"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/inbox");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      
      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 max-w-sm w-full text-center"
      >
        
        {/* Logo Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-4"
        >
          AudienceHQ
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white/90 mb-8"
        >
          Your unified inbox, smarter & faster ✨
        </motion.p>

        {/* Google Button Animation */}
        <motion.button
          onClick={() => signIn("google", { callbackUrl: "/inbox" })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center justify-center gap-3 w-full bg-white text-gray-800 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl"
        >
          <FcGoogle size={26} />
          Login with Google
        </motion.button>

        {/* Footer Animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 text-sm mt-6"
        >
          Secure OAuth 2.0 Authentication 🔒
        </motion.p>

      </motion.div>
    </div>
  );
}
