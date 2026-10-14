'use client';

import { useEffect, useState } from 'react';

const sections = [
    { id: 'roots-section', label: 'Roots' },
    { id: 'trunk-section', label: 'Codifier' },
    { id: 'branches-section', label: 'Branches' },
    { id: 'rival-section', label: 'Rival' },
];

export function TimelineNavigator() {
    const [active, setActive] = useState('');

    useEffect(() => {
        // The section crossing the vertical middle of the viewport is the active one.
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
            { rootMargin: '-50% 0px -50% 0px' }
        );
        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <nav data-export-ignore aria-label="Sections" className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
            <ul className="space-y-3 text-right text-sm">
                {sections.map(({ id, label }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            aria-current={active === id ? 'true' : undefined}
                            className={active === id
                                ? 'text-accent underline decoration-1'
                                : 'text-muted-foreground hover:text-foreground transition-colors'}
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
