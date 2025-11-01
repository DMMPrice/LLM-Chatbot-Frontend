import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Send} from "lucide-react";

function ChatInput({onSendMessage, disabled}) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="border-t border-border p-4 lg:p-6 glass-card">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-5xl mx-auto">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about customers..."
                    className="resize-none min-h-[60px] glass-card border-muted bg-background/50"
                    disabled={disabled}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={disabled || !message.trim()}
                    className="h-[60px] w-[60px] bg-gradient-to-br from-primary to-secondary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0"
                >
                    <Send className="w-5 h-5"/>
                </Button>
            </form>
        </div>
    );
}

export default ChatInput;
