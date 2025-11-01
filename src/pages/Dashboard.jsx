// src/pages/Dashboard.jsx
import React, {useEffect, useRef, useState} from "react";
import Sidebar from "@/Component/Sidebar.jsx";
import ChatMessage from "@/Component/ChatMessage.jsx";
import ChatInput from "@/Component/ChatInput.jsx";
import {Loader2} from "lucide-react";
import axios from "axios";
import {API_BASE_URL, API_TOKEN} from "@/config.js";

function Dashboard() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            role: "assistant",
            content:
                "Hello! I'm QueryIQ, your AI assistant. Ask me anything about your customer data, and I'll help you find insights.",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll to the latest message
    const scrollRef = useRef(null);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, isTyping]);

    const handleSendMessage = async (content) => {
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const {data} = await axios.post(
                `${API_BASE_URL}/chat/`,
                {query: content},
                {headers: {"x_token": API_TOKEN}}
            );

            // Only pass the rows; do not pass SQL
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content:
                        "Based on your query, I've analyzed the customer data. Here are the results:",
                    timestamp: new Date(),
                    tableData: Array.isArray(data?.rows) ? data.rows : [],
                    error: data?.error ?? null,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Sorry, I couldn’t connect to the backend.",
                    timestamp: new Date(),
                    error: err.message,
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <Sidebar/>

            <main className="flex-1 flex flex-col lg:ml-0 bg-slate-50">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto w-full px-4 lg:px-0 py-6 lg:py-8 space-y-6">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message}/>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2 text-muted-foreground animate-fade-in-up">
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                <span className="text-sm">QueryIQ is thinking...</span>
                            </div>
                        )}

                        {/* Scroll anchor */}
                        <div ref={scrollRef}/>
                    </div>
                </div>

                {/* Input */}
                <ChatInput onSendMessage={handleSendMessage} disabled={isTyping}/>
            </main>
        </div>
    );
}

export default Dashboard;
