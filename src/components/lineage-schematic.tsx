/** Authored diagram of the four stages the app returns. Shown before the first search. */
const stages = [
    { y: 48, title: 'Roots', note: 'where it came from' },
    { y: 140, title: 'Codifier', note: 'who gave it form' },
    { y: 235, title: 'Branches', note: 'where it went' },
    { y: 335, title: 'Rival', note: 'what it argued against' },
];

const branchTips = [[170, 205], [170, 235], [170, 265]];

export function LineageSchematic() {
    return (
        <svg
            viewBox="0 0 380 380"
            role="img"
            aria-label="Diagram: roots lead to a codifier, which splits into branches, with a rival standing apart"
            className="w-full max-w-sm text-foreground"
        >
            {/* roots merge into the spine */}
            <path d="M52 28 C 52 70, 100 70, 100 110" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M52 68 C 52 90, 100 90, 100 110" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100 20 L 100 140" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* spine carries on in accent, then fans into branches */}
            <path d="M100 140 L 100 270" fill="none" stroke="var(--accent)" strokeWidth="2" />
            {branchTips.map(([x, y]) => (
                <path key={y} d={`M100 235 C 135 235, 135 ${y}, ${x} ${y}`} fill="none" stroke="currentColor" strokeWidth="1" />
            ))}
            {/* the rival stands apart, dashed */}
            <path d="M100 270 L 100 335" fill="none" stroke="var(--rival)" strokeWidth="1" strokeDasharray="3 4" />

            {[[52, 28], [52, 68], [100, 20], ...branchTips].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="var(--background)" stroke="currentColor" strokeWidth="1.25" />
            ))}
            <rect x="92" y="132" width="16" height="16" fill="var(--accent-slab)" />
            <circle cx="100" cy="335" r="5" fill="var(--rival)" />

            {stages.map(({ y, title, note }) => (
                <g key={title}>
                    <text x="215" y={y} fontSize="18" fill="currentColor" className="font-display">{title}</text>
                    <text x="215" y={y + 19} fontSize="12" fill="var(--muted-foreground)">{note}</text>
                </g>
            ))}
        </svg>
    );
}
