"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="relative">
        {/* Outer Glow Ring */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -inset-12 rounded-full border border-primary/20 bg-primary/5 blur-2xl"
        />
        
        {/* Rotating border ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 rounded-full border-t-2 border-r-2 border-primary/40 border-l-transparent border-b-transparent"
        />

        {/* Logo Container */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative w-32 h-32 flex items-center justify-center bg-black rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(197,165,114,0.3)] overflow-hidden"
        >
          <Image
            src="/logo.png"
            alt="Slideverse Logo"
            width={100}
            height={100}
            className="w-20 h-20 object-contain brightness-110"
            priority
          />
          
          {/* Scanning Effect */}
          <motion.div
            animate={{ top: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent -z-10"
          />
        </motion.div>

        {/* Text Loader */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-max text-center">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic"
          >
            Initializing Protocol
          </motion.div>
          <div className="mt-2 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
