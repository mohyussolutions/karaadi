import { ShieldCheck } from "lucide-react";

export const ChatEmptyState = ({ isMobile }: { isMobile: boolean }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50 p-6">
    <div className="text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
        <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
      </div>
      <p className="text-lg md:text-xl font-bold text-gray-800 mb-2">
        {isMobile ? "Select a conversation" : "Welcome to Messages"}
      </p>
      <p className="text-sm text-gray-400">
        {isMobile
          ? "Tap on a chat to start messaging"
          : "Select a conversation to start chatting"}
      </p>
    </div>
  </div>
);
