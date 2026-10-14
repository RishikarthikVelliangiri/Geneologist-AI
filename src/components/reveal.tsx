'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Fired by the export button so everything is visible (and the ribbon fully drawn) when the PNG is taken. */
export const REVEAL_ALL = 'reveal-all';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    from?: 'left' | 'right';
    delay?: number;
}

/** Eases its children up (and in from a side) the first time they scroll into view. */
export function Reveal({ children, className, from, delay = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
    const reduceMotion = useReducedMotion();
    const [forced, setForced] = useState(false);

    useEffect(() => {
        const show = () => setForced(true);
        window.addEventListener(REVEAL_ALL, show);
        return () => window.removeEventListener(REVEAL_ALL, show);
    }, []);

    const visible = inView || forced || reduceMotion;
    const x = from === 'left' ? -28 : from === 'right' ? 28 : 0;

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={visible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y: 32 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
