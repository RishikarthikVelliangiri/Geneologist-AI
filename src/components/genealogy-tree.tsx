'use client';

import { GenealogyData } from '@/types';
import { useScroll } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ExportButton } from './export-button';
import { Plate } from './plate';
import { Reveal } from './reveal';
import { Ribbon } from './ribbon';
import { TimelineNavigator } from './timeline-navigator';

interface GenealogyTreeProps {
    data: GenealogyData;
    onNodeClick: (term: string) => void;
}

/** A labelled fact: small muted label over the value, like a museum object label. */
function Fact({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <dt className="text-sm text-muted-foreground mb-1">{label}</dt>
            <dd className="max-w-prose">{children}</dd>
        </div>
    );
}

function Trace({ term, onClick, className }: { term: string; onClick: (term: string) => void; className?: string }) {
    return (
        <button
            data-export-ignore
            onClick={() => onClick(term)}
            className={cn('mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline', className)}
        >
            Trace {term}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
    );
}

function SectionHead({ title, note }: { title: string; note: string }) {
    return (
        <Reveal className="mb-10 md:mb-14">
            <h2 className="text-4xl md:text-6xl">{title}</h2>
            <p className="mt-3 text-muted-foreground">{note}</p>
        </Reveal>
    );
}

export function GenealogyTree({ data, onNodeClick }: GenealogyTreeProps) {
    const lineageRef = useRef<HTMLDivElement>(null);
    // The ribbon is drawn in as the reader moves down the lineage.
    const { scrollYProgress } = useScroll({ target: lineageRef, offset: ['start 0.65', 'end 0.9'] });

    const roots = data.roots ?? [];
    const branches = data.branches ?? [];
    const trunk = data.trunk?.key_figure ? data.trunk : undefined;
    const rival = data.rival?.name ? data.rival : undefined;

    return (
        <article id="genealogy-tree-container" className="mx-auto w-full max-w-6xl px-6 pb-32 pt-12 md:pt-20">
            <TimelineNavigator />

            <header className="grid gap-10 pb-20 md:grid-cols-[1fr_22rem] md:items-end md:pb-28">
                <div>
                    <h1 className="break-words text-6xl md:text-8xl">{data.concept}</h1>
                    <p className="mt-8 max-w-2xl font-display text-2xl leading-snug md:text-3xl">{data.summary}</p>
                    <div className="mt-10">
                        <ExportButton targetId="genealogy-tree-container" fileName={`genealogy-${data.concept.toLowerCase().replace(/\s+/g, '-')}`} />
                    </div>
                </div>
                <figure>
                    <Plate src={data.image_url} alt={data.concept} priority className="aspect-[4/5] w-full" />
                    {data.image_title && (
                        <figcaption className="mt-3 text-sm text-muted-foreground">
                            Image: Wikipedia,{' '}
                            <a
                                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(data.image_title.replace(/ /g, '_'))}`}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-foreground"
                            >
                                {data.image_title}
                            </a>
                        </figcaption>
                    )}
                </figure>
            </header>

            <div ref={lineageRef} className="relative pl-10 md:pl-20">
                <Ribbon progress={scrollYProgress} />

                {roots.length > 0 && (
                    <section id="roots-section" className="pb-24 md:pb-32">
                        <SectionHead title="Where it came from" note="The thinkers and traditions it grew out of, oldest first." />
                        <ol>
                            {roots.map((root, i) => (
                                <li key={i} className="border-t border-rule py-10">
                                    <Reveal from="left" className="grid gap-x-8 gap-y-5 md:grid-cols-[9rem_1fr_8rem]">
                                        <div className="order-1">
                                            <p className="font-display text-2xl">{root.era}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{root.location}</p>
                                        </div>
                                        <Plate src={root.image_url} alt={root.name} className="order-2 aspect-[4/5] w-24 md:order-3 md:w-full" />
                                        <div className="order-3 md:order-2">
                                            <h3 className="mb-6 text-3xl md:text-5xl">{root.name}</h3>
                                            <dl className="space-y-5">
                                                <Fact label="What they contributed">{root.contribution}</Fact>
                                                <Fact label="Why it mattered">{root.impact}</Fact>
                                            </dl>
                                            <Trace term={root.name} onClick={onNodeClick} />
                                        </div>
                                    </Reveal>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {trunk && (
                    <section id="trunk-section" className="pb-24 md:pb-32">
                        <Reveal>
                            <div className="bg-slab px-6 py-12 text-slab-foreground md:px-14 md:py-16">
                                <div className="grid gap-10 md:grid-cols-[1fr_15rem]">
                                    <div>
                                        <h2 className="break-words text-5xl md:text-7xl">{trunk.key_figure}</h2>
                                        <p className="mt-4 text-slab-foreground/85">Codified in {trunk.year}</p>
                                        <p className="mt-8 text-sm text-slab-foreground/85">Defining work</p>
                                        <p className="mt-1 max-w-xl font-display text-3xl leading-tight md:text-4xl">{trunk.defining_work}</p>
                                    </div>
                                    {/* No monogram here: on a slab, a missing portrait reads as noise */}
                                    {trunk.image_url && (
                                        <Plate src={trunk.image_url} alt={trunk.key_figure} className="aspect-[4/5] w-48 md:w-full" />
                                    )}
                                </div>
                                <dl className="mt-12 grid gap-8 border-t border-slab-foreground/30 pt-8 md:grid-cols-2">
                                    <div>
                                        <dt className="mb-1 text-sm text-slab-foreground/85">The world around it</dt>
                                        <dd className="max-w-prose">{trunk.context}</dd>
                                    </div>
                                    <div>
                                        <dt className="mb-1 text-sm text-slab-foreground/85">What it left behind</dt>
                                        <dd className="max-w-prose">{trunk.influence}</dd>
                                    </div>
                                </dl>
                                <Trace term={trunk.key_figure} onClick={onNodeClick} className="text-slab-foreground" />
                            </div>
                        </Reveal>
                    </section>
                )}

                {branches.length > 0 && (
                    <section id="branches-section" className="pb-24 md:pb-32">
                        <SectionHead title="Where it went" note="How the idea has been carried forward and changed." />
                        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2">
                            {branches.map((branch, i) => (
                                <li key={i}>
                                    <Reveal from={i % 2 === 0 ? 'left' : 'right'} className="border-t border-rule pt-6">
                                        <Plate src={branch.image_url} alt={branch.name} className="mb-6 aspect-[4/3] w-full" />
                                        <h3 className="mb-4 text-3xl md:text-4xl">{branch.name}</h3>
                                        <p className="max-w-prose">{branch.description}</p>
                                        <dl className="mt-6 space-y-4">
                                            <Fact label="Associated with">{branch.key_proponent}</Fact>
                                            <Fact label="Seen today in">{branch.modern_example}</Fact>
                                        </dl>
                                        <Trace term={branch.name} onClick={onNodeClick} />
                                    </Reveal>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {rival && (
                    <section id="rival-section">
                        <Reveal from="right">
                            {/* The mirror of the codifier: ink where it was blue, right-aligned where it was left, name reflected below. */}
                            <div className="bg-foreground px-6 py-12 text-background md:px-14 md:py-16 md:text-right">
                                <p className="text-sm text-background/75">What it argued against</p>
                                <h2 className="mt-4 break-words text-5xl md:text-7xl">{rival.name}</h2>
                                <div
                                    aria-hidden
                                    className="-mt-1 h-10 select-none overflow-hidden opacity-30 [mask-image:linear-gradient(to_top,black,transparent)] md:h-14"
                                >
                                    <div className="font-display text-5xl leading-[1.05] tracking-[-0.015em] [transform:scaleY(-1)] md:text-7xl">{rival.name}</div>
                                </div>
                                <p className="mt-10 max-w-2xl font-display text-2xl leading-snug md:ml-auto md:text-3xl">{rival.why_it_opposes}</p>
                                <dl className="mt-10 grid gap-6 border-t border-background/30 pt-8 md:grid-cols-2">
                                    <div>
                                        <dt className="mb-1 text-sm text-background/75">Its champion</dt>
                                        <dd className="md:ml-auto md:max-w-prose">{rival.key_figure}</dd>
                                    </div>
                                    <div>
                                        <dt className="mb-1 text-sm text-background/75">Where it began</dt>
                                        <dd className="md:ml-auto md:max-w-prose">{rival.origin}</dd>
                                    </div>
                                </dl>
                                <Trace term={rival.name} onClick={onNodeClick} className="text-rival-slab" />
                            </div>
                        </Reveal>
                    </section>
                )}
            </div>
        </article>
    );
}
