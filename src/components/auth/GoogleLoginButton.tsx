"use client";

import { useAuth } from "@/context/AuthContext";

export default function GoogleLoginButton({ label = "Continue with Google" }: { label?: string }) {
  const { googleLogin, isLoading } = useAuth();

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isLoading}
      className="group relative w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-primary/40 py-5 md:py-6 rounded-2xl transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 overflow-hidden active:scale-[0.98] disabled:opacity-50"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.05),transparent)] bg-[length:200%_100%] animate-[shimmer_3s_infinite] pointer-events-none" />

      <div className="relative z-10 flex items-center gap-4 w-full px-4 justify-center">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] border border-white/20 transition-transform group-hover:scale-110 duration-500">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.71 1.7l3.54-3.54C18.11 1.21 15.28 0 12 0 7.33 0 3.3 2.69 1.3 6.65l4.23 3.28C6.51 7.21 9.01 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.74-2.4 3.58l3.71 2.88c2.16-1.99 3.42-4.93 3.42-8.7z" />
              <path fill="#FBBC05" d="M5.53 14.54c-.26-.77-.4-1.58-.4-2.54 0-.96.14-1.77.4-2.54L1.3 6.19C.47 7.9 0 9.89 0 12c0 2.11.47 4.1 1.3 5.81l4.23-3.27z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.71-2.88c-1.07.72-2.45 1.15-4.23 1.15-3.26 0-6.02-2.2-7.01-5.16l-4.23 3.28C3.31 21.31 7.33 24 12 24z" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-zinc-400 group-hover:text-white font-black text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.05em] md:tracking-[0.15em] transition-all italic whitespace-nowrap">
          {label.replace(/_/g, ' ')}
        </span>
      </div>
    </button>
  );
}
