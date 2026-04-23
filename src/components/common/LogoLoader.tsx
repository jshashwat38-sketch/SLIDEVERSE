"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LogoLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Glowing Outer Ring */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -inset-4 border-2 border-primary/30 rounded-full blur-sm"
        />
        
        {/* Logo Image */}
        <motion.div
          animate={{
            rotateY: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <Image
            src="/logo.png"
            alt="Loading..."
            width={80}
            height={80}
            priority
            className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(197,165,114,0.4)]"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse italic">
          Initializing Vault
        </span>
        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: [-128, 128],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}
