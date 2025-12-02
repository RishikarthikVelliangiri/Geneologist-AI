'use client';

import { GenealogyData } from '@/types';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TiltCard } from './tilt-card';
import { TypewriterText } from './typewriter-text';
import { TimelineNavigator } from './timeline-navigator';
import { ExportButton } from './export-button';

interface GenealogyTreeProps {
    data: GenealogyData;
    onNodeClick: (term: string) => void;
}

// Animated connector component
function AnimatedConnector({ fromSide, toSide, delay = 0 }: { fromSide: 'left' | 'right' | 'center'; toSide: 'left' | 'right' | 'center'; delay?: number }) {
    const pathRef = useRef(null);
    const isInView = useInView(pathRef, { once: true, margin: "-100px" });

    // Generate paths based on from/to positions
    let pathD = "";
    let strokeWidth = "2";

    if (fromSide === 'center' && toSide === 'left') {
        // Center to left
        pathD = "M 50 0 C 50 30, 35 60, 25 100";
    } else if (fromSide === 'center' && toSide === 'right') {
        // Center to right
        pathD = "M 50 0 C 50 30, 65 60, 75 100";
    } else if (fromSide === 'left' && toSide === 'center') {
        // Left to center
        pathD = "M 25 0 C 25 30, 35 60, 50 100";
    } else if (fromSide === 'right' && toSide === 'center') {
        // Right to center
        pathD = "M 75 0 C 75 30, 65 60, 50 100";
    } else if (fromSide === 'left' && toSide === 'right') {
        // Left to right - s-curve
        pathD = "M 25 0 C 25 25, 60 75, 75 100";
    } else if (fromSide === 'right' && toSide === 'left') {
        // Right to left - s-curve
        pathD = "M 75 0 C 75 25, 40 75, 25 100";
    } else if (fromSide === 'center' && toSide === 'center') {
        // Center to center - straight
        pathD = "M 50 0 L 50 100";
        strokeWidth = "3";
    }

    return (
        <div className="absolute left-0 right-0 -top-16 h-48 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Base Path */}
                <motion.path
                    ref={pathRef}
                    d={pathD}
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 1.5, delay, ease: "easeInOut" }}
                />

                {/* Traveling Pulse */}
                {isInView && (
                    <motion.path
                        d={pathD}
                        stroke="white"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 0.3, 0],
                            pathOffset: [0, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay + 1,
                            repeatDelay: 0.5
                        }}
                        style={{ filter: "drop-shadow(0 0 2px white)" }}
                    />
                )}

                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(0, 243, 255)" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="rgb(188, 19, 254)" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgb(0, 243, 255)" stopOpacity="0.6" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export function GenealogyTree({ data, onNodeClick }: GenealogyTreeProps) {
    // Safety checks for data integrity
    if (!data) {
        return (
            <div className="text-center py-20 px-4">
                <p className="text-muted-foreground text-lg">No data available</p>
            </div>
        );
    }

    // Ensure all required arrays exist
    const roots = data.roots || [];
    const branches = data.branches || [];
    const hasRoots = roots.length > 0;
    const hasBranches = branches.length > 0;
    const hasTrunk = data.trunk && data.trunk.key_figure;
    const hasRival = data.rival && data.rival.name;

    // Calculate connection types
    const getNextSide = (currentIndex: number, totalItems: number) => {
        if (currentIndex >= totalItems - 1) return 'center';
        return currentIndex % 2 === 0 ? 'right' : 'left';
    };

    return (
        <div id="genealogy-tree-container" className="w-full max-w-7xl mx-auto py-12 px-4 relative">
            <TimelineNavigator />
            <ExportButton targetId="genealogy-tree-container" />
            {/* Header Section */}
            <div className="text-center mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground mb-4 tracking-tight">
                        {data.concept}
                    </h1>
                    <div className="h-1 w-24 mx-auto bg-neon-blue shadow-[0_0_15px_var(--neon-blue)] rounded-full mb-6" />
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        {data.summary}
                    </p>
                </motion.div>
            </div>

            {/* Dynamic Concept Image */}
            {data.image_url && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-20 relative max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden border border-border shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`/api/proxy-image?url=${encodeURIComponent(data.image_url)}`}
                        alt={data.concept}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.display = 'none';
                        }}
                    />
                    <div className="absolute bottom-4 right-4 z-20 text-xs text-muted-foreground/50 font-mono">
                        Image via Google
                    </div>
                </motion.div>
            )}

            {/* Initial connector from center to first root */}
            {hasRoots && (
                <div className="relative h-32 mb-12">
                    <AnimatedConnector fromSide="center" toSide="left" delay={0} />
                </div>
            )}

            {/* Roots Section */}
            {hasRoots && (
                <div id="roots-section" className="mb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-neon-blue mb-3 tracking-tight">
                            The Roots
                        </h2>
                        <p className="text-base text-muted-foreground font-mono">Ancient foundations</p>
                    </motion.div>

                    <div className="relative">
                        {roots.map((root, index) => {
                            const isLeft = index % 2 === 0;
                            const nextSide = getNextSide(index, roots.length);
                            const currentSide = isLeft ? 'left' : 'right';

                            return (
                                <div key={index} className="relative mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: isLeft ? -100 : 100, rotateY: isLeft ? -15 : 15 }}
                                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                                        viewport={{ once: true, margin: "-150px" }}
                                        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                                        style={{ perspective: 1000 }}
                                        className={`w-full md:w-[48%] ${isLeft ? 'md:ml-0' : 'md:ml-auto'} min-h-[60vh] flex items-center relative z-10`}
                                    >
                                        <TiltCard>
                                            <div className="w-full p-8 md:p-12 rounded-3xl border-2 border-neon-blue/30 bg-gradient-to-br from-background via-background/95 to-neon-blue/5 shadow-[0_0_40px_rgba(0,243,255,0.12)] transition-all duration-500 backdrop-blur-sm relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-neon-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-5">
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="h-1 w-16 bg-gradient-to-r from-neon-blue to-transparent rounded-full" />
                                                            <span className="text-xs font-mono text-neon-blue/70 tracking-widest uppercase">Root {index + 1}</span>
                                                        </div>
                                                        {root.image_url && (
                                                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neon-blue/50 shadow-[0_0_20px_rgba(0,243,255,0.3)] shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={`/api/proxy-image?url=${encodeURIComponent(root.image_url)}`}
                                                                    alt={root.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none';
                                                                        e.currentTarget.parentElement!.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <h3 className="text-3xl md:text-5xl font-bold mb-5 text-foreground group-hover:text-neon-blue transition-colors duration-300">
                                                        {root.name}
                                                    </h3>

                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        <div>
                                                            <div className="text-xs font-mono text-neon-blue/50 uppercase tracking-wider mb-1">Era</div>
                                                            <div className="text-lg md:text-xl text-neon-blue/80 font-mono">
                                                                {root.era}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-mono text-neon-blue/50 uppercase tracking-wider mb-1">Location</div>
                                                            <div className="text-lg md:text-xl text-neon-blue/80 font-mono">
                                                                {root.location}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="text-xs font-mono text-neon-blue/50 uppercase tracking-wider mb-2">Contribution</div>
                                                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                                {root.contribution}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <div className="text-xs font-mono text-neon-blue/50 uppercase tracking-wider mb-2">Impact</div>
                                                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                                {root.impact}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => onNodeClick(root.name)}
                                                        className="mt-6 px-6 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/50 rounded-full text-neon-blue text-sm font-mono transition-all duration-300"
                                                    >
                                                        Explore Further →
                                                    </button>
                                                </div>
                                            </div>
                                        </TiltCard>
                                    </motion.div>

                                    {/* Connector to next card */}
                                    <div className="relative h-32">
                                        <AnimatedConnector
                                            fromSide={currentSide}
                                            toSide={nextSide}
                                            delay={0.6}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Trunk Section - Centered */}
            {hasTrunk && (
                <div id="trunk-section" className="mb-20 flex justify-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-150px" }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        style={{ perspective: 1500 }}
                        className="w-full max-w-5xl min-h-[70vh] flex items-center relative z-10"
                    >
                        <TiltCard>
                            <div className="w-full p-10 md:p-16 rounded-3xl border-4 border-neon-purple/40 bg-gradient-to-br from-background via-neon-purple/5 to-background shadow-[0_0_80px_rgba(188,19,254,0.18)] transition-all duration-500 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,19,254,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10 text-center">
                                    <div className="inline-block px-6 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full mb-8">
                                        <span className="text-base font-mono text-neon-purple tracking-widest uppercase">The Codification</span>
                                    </div>

                                    <h2 className="text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                                        {data.trunk.key_figure}
                                    </h2>

                                    <div className="text-xl md:text-2xl text-neon-purple/80 font-mono mb-10">
                                        {data.trunk.year}
                                    </div>
                                    <div className="max-w-3xl mx-auto space-y-6">
                                        <div>
                                            <div className="h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent mb-4" />
                                            <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-wider mb-2">Defining Work</div>
                                            <div className="text-lg md:text-xl text-muted-foreground italic mb-4 min-h-[3rem]">
                                                "<TypewriterText text={data.trunk.defining_work} delay={0.5} />"
                                            </div>
                                            <div className="h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                                            <div className="p-5 bg-neon-purple/5 rounded-2xl border border-neon-purple/20 text-left">
                                                <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-wider mb-2">Context</div>
                                                <p className="text-base text-muted-foreground leading-relaxed">
                                                    {data.trunk.context}
                                                </p>
                                            </div>
                                            <div className="p-5 bg-neon-purple/5 rounded-2xl border border-neon-purple/20 text-left">
                                                <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-wider mb-2">Influence</div>
                                                <p className="text-base text-muted-foreground leading-relaxed">
                                                    {data.trunk.influence}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onNodeClick(data.trunk.key_figure)}
                                        className="mt-10 px-10 py-4 bg-neon-purple/10 hover:bg-neon-purple/20 border-2 border-neon-purple/50 rounded-full text-neon-purple font-mono text-base transition-all duration-300"
                                    >
                                        Dive Deeper →
                                    </button>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            )}

            {/* Connector from Trunk to first branch */}
            {
                hasTrunk && hasBranches && (
                    <div className="relative h-32 mb-12">
                        <AnimatedConnector fromSide="center" toSide="left" delay={0.2} />
                    </div>
                )
            }

            {/* Branches Section - Alternating */}
            {
                hasBranches && (
                    <div id="branches-section" className="mb-20 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold text-neon-purple mb-3 tracking-tight">
                                Modern Evolution
                            </h2>
                            <p className="text-base text-muted-foreground font-mono">How the idea transformed</p>
                        </motion.div>

                        <div className="relative">
                            {branches.map((branch, index) => {
                                const isLeft = index % 2 === 0;
                                const nextSide = getNextSide(index, branches.length);
                                const currentSide = isLeft ? 'left' : 'right';

                                return (
                                    <div key={index} className="relative mb-8">
                                        <motion.div
                                            initial={{ opacity: 0, x: isLeft ? -100 : 100, rotateY: isLeft ? -15 : 15 }}
                                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                                            viewport={{ once: true, margin: "-150px" }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            style={{ perspective: 1000 }}
                                            className={`w-full md:w-[48%] ${isLeft ? 'md:ml-0' : 'md:ml-auto'} min-h-[60vh] flex items-center relative z-10`}
                                        >
                                            <TiltCard>
                                                <div className="w-full p-8 md:p-12 rounded-3xl border-2 border-neon-purple/30 bg-gradient-to-br from-background via-background/95 to-neon-purple/5 shadow-[0_0_40px_rgba(188,19,254,0.12)] transition-all duration-500 backdrop-blur-sm relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-gradient-to-l from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-start mb-5">
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <div className="h-1 w-16 bg-gradient-to-r from-neon-purple to-transparent rounded-full" />
                                                                <span className="text-xs font-mono text-neon-purple/70 tracking-widest uppercase">Branch {index + 1}</span>
                                                            </div>
                                                            {branch.image_url && (
                                                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neon-purple/50 shadow-[0_0_20px_rgba(188,19,254,0.3)] shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={`/api/proxy-image?url=${encodeURIComponent(branch.image_url)}`}
                                                                        alt={branch.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none';
                                                                            e.currentTarget.parentElement!.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <h3 className="text-3xl md:text-5xl font-bold mb-6 text-foreground group-hover:text-neon-purple transition-colors duration-300">
                                                            {branch.name}
                                                        </h3>

                                                        <div className="space-y-5">
                                                            <div>
                                                                <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-wider mb-2">Evolution</div>
                                                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                                    {branch.description}
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="p-4 bg-neon-purple/5 rounded-xl border border-neon-purple/20">
                                                                    <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-wider mb-1">Key Proponent</div>
                                                                    <p className="text-base text-muted-foreground">
                                                                        {branch.key_proponent}
                                                                    </p>
                                                                </div>
                                                                <div className="p-4 bg-neon-purple/5 rounded-xl border border-neon-purple/20">
                                                                    <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-wider mb-1">Modern Example</div>
                                                                    <p className="text-base text-muted-foreground">
                                                                        {branch.modern_example}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => onNodeClick(branch.name)}
                                                            className="mt-6 px-6 py-3 bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/50 rounded-full text-neon-purple text-sm font-mono transition-all duration-300"
                                                        >
                                                            Investigate →
                                                        </button>
                                                    </div>
                                                </div>
                                            </TiltCard>
                                        </motion.div>

                                        {/* Connector to next card */}
                                        <div className="relative h-32">
                                            <AnimatedConnector
                                                fromSide={currentSide}
                                                toSide={nextSide}
                                                delay={0.6}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* Rival Section - Centered */}
            {
                hasRival && (
                    <div id="rival-section" className="mb-20 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold text-destructive mb-3 tracking-tight">
                                The Opposition
                            </h2>
                            <p className="text-base text-muted-foreground font-mono">Conflicting philosophy</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-150px" }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            style={{ perspective: 1200 }}
                            className="max-w-5xl mx-auto min-h-[70vh] flex items-center relative z-10"
                        >
                            <TiltCard>
                                <div className="w-full p-10 md:p-16 rounded-3xl border-3 border-destructive/40 bg-gradient-to-br from-background via-destructive/5 to-background shadow-[0_0_60px_rgba(239,68,68,0.15)] transition-all duration-500 backdrop-blur-sm relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6 justify-center">
                                            <div className="h-1 w-24 bg-gradient-to-r from-destructive to-transparent rounded-full" />
                                            <span className="text-xs font-mono text-destructive/70 tracking-widest uppercase">Rival Philosophy</span>
                                            <div className="h-1 w-24 bg-gradient-to-l from-destructive to-transparent rounded-full" />
                                        </div>

                                        <h3 className="text-4xl md:text-6xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-destructive to-red-500">
                                            {data.rival.name}
                                        </h3>

                                        <div className="max-w-3xl mx-auto space-y-6">
                                            <div>
                                                <div className="h-px bg-gradient-to-r from-destructive via-destructive/50 to-transparent mb-4" />
                                                <div className="text-xs font-mono text-destructive/50 uppercase tracking-wider mb-2 text-center">The Conflict</div>
                                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed italic mb-4 text-center">
                                                    {data.rival.why_it_opposes}
                                                </p>
                                                <div className="h-px bg-gradient-to-r from-transparent via-destructive/50 to-destructive" />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-5 mt-8">
                                                <div className="p-5 bg-destructive/5 rounded-2xl border border-destructive/20">
                                                    <div className="text-xs font-mono text-destructive/50 uppercase tracking-wider mb-2">Key Figure</div>
                                                    <p className="text-base text-muted-foreground leading-relaxed">
                                                        {data.rival.key_figure}
                                                    </p>
                                                </div>
                                                <div className="p-5 bg-destructive/5 rounded-2xl border border-destructive/20">
                                                    <div className="text-xs font-mono text-destructive/50 uppercase tracking-wider mb-2">Origin</div>
                                                    <p className="text-base text-muted-foreground leading-relaxed">
                                                        {data.rival.origin}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center mt-8">
                                            <button
                                                onClick={() => onNodeClick(data.rival.name)}
                                                className="px-10 py-4 bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/50 rounded-full text-destructive font-mono text-base transition-all duration-300"
                                            >
                                                Challenge the Idea →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>
                )}
        </div>
    );
}
