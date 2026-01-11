import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputAreaProps {
  selectedChat: any;
  sending: boolean;
  isConnected: boolean;
  isMobile: boolean;
  initialMessage?: string;
  onSendMessage: (content: string) => void;
}

export default function ChatInputArea({
  selectedChat,
  sending,
  isConnected,
  isMobile,
  initialMessage = "",
  onSendMessage,
}: ChatInputAreaProps) {
  const [newMessage, setNewMessage] = useState(initialMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;

      if (isMobile && selectedChat) {
        setTimeout(() => textarea.focus(), 300);
      }
    }
  }, [newMessage, isMobile, selectedChat]);

  const handleSend = () => {
    if (!newMessage.trim() || sending) return;
    onSendMessage(newMessage);
    setNewMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto relative flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[2rem] p-2 transition-all focus-within:ring-[5px] focus-within:ring-blue-600/10 focus-within:border-blue-500 focus-within:bg-white shadow-sm">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Message ${
            selectedChat?.otherUser?.username || "Seller"
          }...`}
          className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-4 text-slate-700 text-sm md:text-base resize-none leading-relaxed placeholder:text-slate-400 rounded-[1.8rem]"
          rows={1}
          style={{
            minHeight: "60px",
            maxHeight: "180px",
            overflowY: "auto",
          }}
          disabled={sending}
        />

        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className={`group flex items-center justify-center h-[52px] w-[52px] md:w-auto md:px-8 rounded-[1.5rem] font-bold transition-all shrink-0 ${
            !newMessage.trim() || sending
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-90"
          }`}
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="hidden md:inline mr-2">Send</span>
              <Send className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>

      <div className="max-w-5xl mx-auto flex justify-between items-center px-5 mt-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
        <div className="flex items-center gap-6">
          <span className="hidden md:block opacity-50 italic lowercase">
            shift + enter for new line
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                  : "bg-red-500"
              }`}
            />
            {isConnected ? "Secure" : "Offline"}
          </span>
        </div>
        <span className="text-blue-600/40">Karaadi Protection Active</span>
      </div>
    </div>
  );
}
