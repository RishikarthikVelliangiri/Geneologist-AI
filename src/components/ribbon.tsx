'use client';

import { MotionValue, motion, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { REVEAL_ALL } from './reveal';

const WAVELENGTH = 340;
const STEP = 6;

/**
 * Two strands braided down the left gutter of the lineage. Faint all the way,
 * drawn in as the reader scrolls, with a bead riding the leading edge.
 * Fills its positioned parent; the gutter width is the parent's left padding.
 */
export function Ribbon({ progress }: { progress: MotionValue<number> }) {
    const ref = useRef<SVGSVGElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [forced, setForced] = useState(false);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const parent = ref.current?.parentElement;
        if (!parent) return;
        const measure = () => setSize({ w: parseFloat(getComputedStyle(parent).paddingLeft), h: parent.offsetHeight });
        const observer = new ResizeObserver(measure);
        observer.observe(parent);
        measure();
        const full = () => setForced(true);
        window.addEventListener(REVEAL_ALL, full);
        return () => {
            observer.disconnect();
            window.removeEventListener(REVEAL_ALL, full);
        };
    }, []);

    const { w, h } = size;
    const cx = w / 2;
    const amp = w * 0.34;
    const x = (y: number, phase: number) => cx + amp * Math.sin((2 * Math.PI * y) / WAVELENGTH + phase);

    const strand = (phase: number) => {
        let d = '';
        for (let y = 0; y <= h; y += STEP) d += `${y ? 'L' : 'M'}${x(y, phase).toFixed(1)} ${y}`;
        return d;
    };

    const drawn = reduceMotion || forced ? 1 : progress;
    const beadY = useTransform(progress, (p) => p * h);
    const beadX = useTransform(progress, (p) => x(p * h, 0));

    if (!w || !h) return <svg ref={ref} aria-hidden className="absolute left-0 top-0 h-full w-full" />;

    return (
        <svg ref={ref} aria-hidden width={w} height={h} className="pointer-events-none absolute left-0 top-0">
            <path d={strand(0)} fill="none" stroke="var(--rule)" strokeWidth="1" />
            <path d={strand(Math.PI)} fill="none" stroke="var(--rule)" strokeWidth="1" />
            <motion.path d={strand(Math.PI)} fill="none" stroke="var(--foreground)" strokeWidth="1" strokeOpacity="0.55" style={{ pathLength: drawn }} />
            <motion.path d={strand(0)} fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinecap="round" style={{ pathLength: drawn }} />
            {!(reduceMotion || forced) && <motion.circle r="5" fill="var(--accent)" style={{ cx: beadX, cy: beadY }} />}
        </svg>
    );
}
