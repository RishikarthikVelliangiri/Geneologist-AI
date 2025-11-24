'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const sections = [
    { id: 'roots-section', label: 'Roots' },
    { id: 'trunk-section', label: 'The Trunk' },
    { id: 'branches-section', label: 'Branches' },
    { id: 'rival-section', label: 'Rival' },
];

export function TimelineNavigator() {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.2, rootMargin: "-20% 0px -20% 0px" }
        );

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-6">
            {sections.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="group flex items-center gap-4 relative"
                >
                    <span className={`text-sm font-mono transition-all duration-300 ${activeSection === id ? 'text-neon-blue opacity-100' : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                        }`}>
                        {label}
                    </span>
                    <div className={`w-3 h-3 rounded-full border transition-all duration-300 ${activeSection === id
                            ? 'bg-neon-blue border-neon-blue shadow-[0_0_10px_var(--neon-blue)] scale-125'
                            : 'bg-transparent border-muted-foreground/50 group-hover:border-neon-blue/50'
                        }`} />
                    {activeSection === id && (
                        <motion.div
                            layoutId="active-glow"
                            className="absolute right-0 w-3 h-3 rounded-full bg-neon-blue blur-sm"
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </button>
            ))}
            <div className="absolute right-[5px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent -z-10" />
        </div>
    );
}
