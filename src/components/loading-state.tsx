'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const STEPS = ['Digging up the roots', 'Finding who wrote it down', 'Following the branches', 'Finding what it argued against', 'Gathering portraits'];
const CYCLE = 9; // seconds for one growth of the tree

/** One stroke of the tree: draws between `start` and `end` (fractions of the cycle), holds, then fades. */
function Stroke({ d, start, end, className, dashed }: { d: string; start: number; end: number; className: string; dashed?: boolean }) {
    return (
        <motion.path
            d={d}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={dashed ? '3 5' : undefined}
            className={className}
            animate={{ pathLength: [0, 0, 1, 1, 1], opacity: [1, 1, 1, 1, 0] }}
            transition={{ duration: CYCLE, times: [0, start, end, 0.92, 1], repeat: Infinity, ease: 'easeInOut' }}
        />
    );
}

function Node({ cx, cy, at, className, r = 5 }: { cx: number; cy: number; at: number; className: string; r?: number }) {
    return (
        <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            className={className}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ scale: [0, 0, 1.4, 1, 1, 0], opacity: [1, 1, 1, 1, 1, 0] }}
            transition={{ duration: CYCLE, times: [0, at, at + 0.04, at + 0.08, 0.92, 1], repeat: Infinity, ease: 'easeOut' }}
        />
    );
}

/** The tree the app returns, growing in the order it is being researched: roots, trunk, branches, rival. */
function GrowingTree() {
    const branchTips = [[250, 215], [250, 255], [250, 295], [250, 175]];
    return (
        <svg viewBox="0 0 320 400" aria-hidden className="w-full max-w-xs">
            <Stroke d="M60 30 C 60 80, 160 80, 160 130" start={0.02} end={0.2} className="stroke-foreground" />
            <Stroke d="M160 20 L 160 130" start={0.02} end={0.2} className="stroke-foreground" />
            <Stroke d="M260 30 C 260 80, 160 80, 160 130" start={0.02} end={0.2} className="stroke-foreground" />
            <Stroke d="M160 130 L 160 300" start={0.22} end={0.5} className="stroke-accent [stroke-width:2.5]" />
            {branchTips.map(([x, y], i) => (
                <Stroke key={y} d={`M160 ${y > 200 ? 260 : 220} C 200 ${y > 200 ? 260 : 220}, 200 ${y}, ${x} ${y}`} start={0.5 + i * 0.05} end={0.7 + i * 0.05} className="stroke-foreground" />
            ))}
            <Stroke d="M160 300 L 160 370" start={0.8} end={0.88} className="stroke-rival" dashed />

            {[[60, 30], [160, 20], [260, 30]].map(([cx, cy], i) => (
                <Node key={cx} cx={cx} cy={cy} at={0.02 + i * 0.03} className="fill-background stroke-foreground [stroke-width:1.5]" />
            ))}
            <motion.rect
                x="150" y="120" width="20" height="20"
                className="fill-slab"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={{ scale: [0, 0, 1.3, 1, 1, 0] }}
                transition={{ duration: CYCLE, times: [0, 0.2, 0.25, 0.3, 0.92, 1], repeat: Infinity, ease: 'easeOut' }}
            />
            {branchTips.map(([cx, cy], i) => (
                <Node key={cy} cx={cx} cy={cy} at={0.68 + i * 0.05} className="fill-background stroke-foreground [stroke-width:1.5]" />
            ))}
            <Node cx={160} cy={370} at={0.88} r={6} className="fill-rival" />
        </svg>
    );
}

export function LoadingState({ concept }: { concept: string }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <div role="status" aria-live="polite" className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_20rem] md:items-center md:py-24">
            <div>
                <h2 className="break-words text-6xl md:text-8xl">{concept}</h2>
                <p key={step} className="loading-step mt-8 font-display text-2xl md:text-3xl">
                    {STEPS[step]}
                    <span className="loading-dots" aria-hidden />
                </p>
                <p className="mt-4 max-w-md text-muted-foreground">This takes about half a minute while the archive is searched.</p>
            </div>
            <div className="flex justify-center md:justify-end">
                <GrowingTree />
            </div>
        </div>
    );
}
