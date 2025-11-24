'use client';

import { motion } from 'framer-motion';

export function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0 border-4 border-neon-blue/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-0 border-t-4 border-neon-blue rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_10px_var(--neon-blue)]" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <motion.h3
                    className="text-xl font-mono text-neon-blue dark:text-neon-blue text-blue-600"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    ANALYZING INTELLECTUAL LINEAGE
                </motion.h3>
                <p className="text-muted-foreground font-mono text-sm">
                    Scanning historical databases...
                </p>
            </div>
        </div>
    );
}
