// src/Component/ChatMessage.jsx
import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

const variants = {
    info: {
        wrap: "bg-slate-100 text-slate-800 border-slate-200",
        icon: Info,
    },
    success: {
        wrap: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: CheckCircle2,
    },
    warning: {
        wrap: "bg-amber-50 text-amber-900 border-amber-200",
        icon: AlertTriangle,
    },
    error: {
        wrap: "bg-rose-50 text-rose-900 border-rose-200",
        icon: AlertCircle,
    },
};

function ChatMessage({ message }) {
    const { role, content, tableData, error, variant = "info" } = message;
    const isAssistant = role === "assistant";
    const isUser = role === "user";
    const isSystem = role === "system";

    // Pick system variant styles
    const V = variants[variant] ?? variants.info;
    const SystemIcon = V.icon;

    return (
        <div
            className={[
                "w-full",
                isAssistant && "flex justify-start",
                isUser && "flex justify-end",
                isSystem && "flex justify-center",
            ].join(" ")}
        >
            <div className={isSystem ? "max-w-2xl w-full" : "max-w-[min(720px,80vw)]"}>
                {/* Message bubble / banner */}
                {isSystem ? (
                    <div
                        className={[
                            "px-4 py-2 rounded-xl border flex items-start gap-2",
                            "mx-auto",
                            V.wrap,
                        ].join(" ")}
                    >
                        <SystemIcon className="w-4 h-4 mt-0.5 shrink-0" />
                        <div className="text-sm leading-relaxed">{content}</div>
                    </div>
                ) : (
                    <div
                        className={[
                            "p-3 rounded-2xl shadow-sm break-words whitespace-pre-wrap",
                            isAssistant
                                ? "bg-white/80 backdrop-blur border border-white/40 text-slate-900"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
                        ].join(" ")}
                    >
                        {content}
                    </div>
                )}

                {/* Error line (for assistant/system when you want to show an error string) */}
                {error && (
                    <div className="mt-2 text-sm text-rose-600">
                        Error: {error}
                    </div>
                )}

                {/* Optional result table (assistant) */}
                {tableData && tableData.length > 0 && (
                    <div className="mt-3 w-full overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                            <tr>
                                {Object.keys(tableData[0] ?? {}).map((key) => (
                                    <th key={key} className="px-3 py-2 text-left font-semibold border-b">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, idx) => (
                                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                                    {Object.keys(tableData[0] ?? {}).map((key) => (
                                        <td key={key} className="px-3 py-2 border-b">
                                            {String(row[key] ?? "")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMessage;
