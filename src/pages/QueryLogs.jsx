import React, {useEffect, useMemo, useState} from "react";
import Sidebar from "@/Component/Sidebar.jsx";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {format, parseISO} from "date-fns";
import axios from "axios";
import {API_BASE_URL, API_TOKEN} from "@/config.js";

// ✅ Status pill
function StatusBadge({status}) {
    const ok = String(status).toLowerCase() === "success";
    const cls = ok
        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30"
        : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-400/30";
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {String(status).toUpperCase()}
    </span>
    );
}

export default function QueryLogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setLoadError("");
            try {
                // IMPORTANT: no trailing slash in API_BASE_URL, explicit /chat/logs path
                const url = `${API_BASE_URL}/chat/logs`;

                const {data, headers} = await axios.get(url, {
                    headers: {
                        // Your FastAPI auth expects x_token (underscore)
                        "x_token": API_TOKEN,
                    },
                    // prevent axios trying to parse HTML as JSON on non-200s that still return text
                    validateStatus: () => true,
                });

                // If server returned HTML (e.g., 404 redirect page), throw a readable error
                const ct = String(headers["content-type"] || "");
                if (!ct.includes("application/json")) {
                    throw new Error(`Non-JSON response (content-type: ${ct || "unknown"})`);
                }
                if (!Array.isArray(data)) {
                    throw new Error("Unexpected payload from /chat/logs");
                }

                const mapped = data.map((d) => ({
                    id: String(d.id ?? ""),
                    userQuery: d.user_query ?? "",
                    sqlQuery: d.generated_sql ?? "",
                    error: d.error ?? null,
                    timestamp: d.created_at ? parseISO(d.created_at) : new Date(),
                    status: d.error ? "failed" : "success",
                }));
                mapped.sort((a, b) => b.timestamp - a.timestamp);
                setRows(mapped);
            } catch (err) {
                setLoadError(err?.message || "Failed to load logs.");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return rows;
        return rows.filter(
            (r) =>
                r.userQuery.toLowerCase().includes(q) ||
                (r.sqlQuery || "").toLowerCase().includes(q)
        );
    }, [rows, searchTerm]);

    return (
        <div className="flex min-h-screen w-full">
            <Sidebar/>

            <main className="flex-1 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">Query Logs</h1>
                        <p className="text-muted-foreground">
                            View your conversation history and generated SQL queries
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                        <Input
                            type="text"
                            placeholder="Search queries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 glass-card border-muted bg-background/50"
                        />
                    </div>

                    {loadError && (
                        <div className="text-sm text-rose-500 border border-rose-300/40 rounded-lg p-3">
                            Failed to load logs: {loadError}
                        </div>
                    )}
                    {loading && (
                        <div className="text-sm text-muted-foreground">Loading logs…</div>
                    )}

                    {!loading && (
                        <div className="glass-card rounded-xl border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            User Query
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Generated SQL
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Status
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((log, idx) => (
                                        <tr
                                            key={log.id}
                                            className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                                                idx % 2 === 0 ? "bg-background/30" : "bg-background/10"
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                                                {log.userQuery}
                                            </td>
                                            <td className="px-6 py-4">
                                                <code
                                                    className="text-xs text-muted-foreground font-mono block max-w-md truncate">
                                                    {log.sqlQuery || "—"}
                                                </code>
                                                {log.error && (
                                                    <div className="mt-1 text-xs text-rose-500">
                                                        {log.error}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                                                {format(log.timestamp, "MMM dd, yyyy HH:mm")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={log.status}/>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No queries found matching your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
