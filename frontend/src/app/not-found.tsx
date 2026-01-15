"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const NotFound = () => {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-100"
      >
        <div className="max-w-md w-full space-y-8">
          <motion.div variants={itemVariants} className="relative">
            <motion.h1
              className="text-8xl md:text-9xl font-extrabold text-indigo-700 mb-2"
              animate={{ color: ["#1e40af", "#4338ca", "#1e40af"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              404
            </motion.h1>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-lg opacity-50 -z-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-semibold text-gray-900">
              Oops! Lost in Space?
            </h2>
            <p className="text-gray-600 text-lg mt-4">
              The page you're looking for has either drifted away or never
              existed. Let's get you back home.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-6">
            <motion.button
              onClick={() => router.push("/")}
              className="relative px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Beam Me Home
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
              <span className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none" />
            </motion.button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-sm pt-8"
          >
            Still lost? Try searching or check our{" "}
            <button
              onClick={() => router.push("/help")}
              className="text-blue-600 hover:underline"
            >
              help center
            </button>
            .
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotFound;
