import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NodeCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    type: 'root' | 'trunk' | 'branch' | 'rival';
    onClick?: () => void;
    className?: string;
}

export function NodeCard({ title, subtitle, description, type, onClick, className }: NodeCardProps) {
    const variants = {
        root: "border-border hover:border-neon-blue/50 bg-card/50 dark:bg-cyber-gray/50",
        trunk: "border-neon-blue bg-card/80 dark:bg-cyber-gray/80 shadow-[0_0_15px_rgba(0,243,255,0.15)] dark:shadow-[0_0_15px_rgba(0,243,255,0.15)]",
        branch: "border-border hover:border-neon-purple/50 bg-card/50 dark:bg-cyber-gray/50",
        rival: "border-destructive/30 hover:border-destructive/50 bg-destructive/5 dark:bg-red-950/10",
    };

    const textColors = {
        root: "text-neon-blue dark:text-neon-blue text-blue-600",
        trunk: "text-foreground",
        branch: "text-neon-purple dark:text-neon-purple text-purple-600",
        rival: "text-destructive dark:text-red-400",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 relative overflow-hidden group",
                variants[type],
                className
            )}
        >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />

            <div className="relative z-10">
                <h3 className={cn("font-bold font-mono text-lg mb-1", textColors[type])}>
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-wider">
                        {subtitle}
                    </p>
                )}
                {description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
