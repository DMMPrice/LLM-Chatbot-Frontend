// src/Component/Sidebar.jsx
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {
    MessageSquare,
    History,
    PanelRightOpen, // hint to expand (when collapsed + hover)
    PanelRightClose, // collapse button (when expanded)
} from "lucide-react";

function Sidebar() {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const toggleSidebar = () => setExpanded((prev) => !prev);
    const sidebarWidth = expanded ? "w-64" : "w-16";

    const navItems = [
        {to: "/", icon: MessageSquare, label: "Chat"},
        {to: "/query-logs", icon: History, label: "Query Logs"},
    ];

    return (
        <>
            <aside
                className={`
          fixed inset-y-0 left-0 z-40
          ${sidebarWidth} h-screen
          flex flex-col justify-between
          bg-gradient-to-b from-[#1e3a8a] via-[#4338ca] to-[#6d28d9]
          text-white border-r border-indigo-700/40
          transition-all duration-300 ease-in-out shadow-lg
        `}
            >
                {/* Header / Toggle control */}
                <div
                    className="p-3 flex items-center gap-3 border-b border-indigo-700/40 select-none"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Gradient round button */}
                    <button
                        onClick={toggleSidebar}
                        title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                        className="
              relative w-10 h-10 rounded-full
              bg-gradient-to-br from-blue-500 to-purple-500
              flex items-center justify-center
              transition-transform duration-200 hover:scale-[0.98] focus:outline-none shadow-md
            "
                    >
                        {expanded ? (
                            <PanelRightClose className="w-5 h-5 text-white"/>
                        ) : hovered ? (
                            <PanelRightOpen className="w-5 h-5 text-white"/>
                        ) : (
                            <img src="/favicon.svg" alt="QueryIQ" className="w-6 h-6"/>
                        )}
                    </button>

                    {/* When expanded, show brand text */}
                    {expanded && (
                        <div className="flex-1">
                            <div className="font-semibold leading-5">QueryIQ</div>
                            <div className="text-xs text-indigo-200">AI Assistant</div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({isActive}) =>
                                `
                  group flex items-center ${expanded ? "justify-start" : "justify-center"}
                  gap-3 rounded-lg
                  ${expanded ? "px-3" : "px-0"} py-2.5
                  transition-colors
                  ${
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "text-indigo-100 hover:bg-white/10 hover:text-white"
                                }
                `
                            }
                            title={!expanded ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5"/>
                            {expanded && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Spacer to offset fixed sidebar */}
            <div className={`${sidebarWidth} shrink-0 transition-all duration-300`}/>
        </>
    );
}

export default Sidebar;
