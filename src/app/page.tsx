'use client';

import { useState } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { GenealogyTree } from '@/components/genealogy-tree';
import { LineageSchematic } from '@/components/lineage-schematic';
import { LoadingState } from '@/components/loading-state';
import { ThemeToggle } from '@/components/theme-toggle';
import { generateGenealogy } from './actions';
import { GenealogyData } from '@/types';

const EXAMPLES = ['Stoicism', 'Democracy', 'Impressionism', 'Entropy'];

export default function Home() {
    const [genealogyData, setGenealogyData] = useState<GenealogyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (concept: string) => {
        setQuery(concept);
        setLoading(true);
        setError(null);
        setGenealogyData(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const result = await generateGenealogy(concept);
            if (result.success && result.data) {
                setGenealogyData(result.data);
            } else {
                setError(result.error || 'Could not trace this concept. Please try again.');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const showHero = !loading && !genealogyData;

    return (
        <div className="min-h-screen bg-background">
            <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
                <span className="shrink-0 font-display text-xl">The Idea Genealogist</span>
                {!showHero && (
                    <div className="order-last w-full md:order-none md:max-w-md md:flex-1">
                        <SearchInput onSearch={handleSearch} isLoading={loading} compact />
                    </div>
                )}
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </header>

            <main>
                {showHero && (
                    <section className="mx-auto grid w-full max-w-6xl gap-16 px-6 pb-24 pt-12 md:grid-cols-[1.4fr_1fr] md:items-center md:pt-24">
                        <div>
                            <h1 className="text-6xl md:text-8xl">Every idea has a family tree.</h1>
                            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
                                Name a concept and see where it came from, who gave it form, what it became, and what it was
                                written against.
                            </p>
                            <div className="mt-12 max-w-2xl">
                                <SearchInput onSearch={handleSearch} isLoading={loading} />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Try{' '}
                                    {EXAMPLES.map((example, i) => (
                                        <span key={example}>
                                            <button onClick={() => handleSearch(example)} className="underline hover:text-accent">
                                                {example}
                                            </button>
                                            {i < EXAMPLES.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                {error && (
                                    <p role="alert" className="mt-6 text-rival">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                        <LineageSchematic />
                    </section>
                )}

                {loading && <LoadingState concept={query} />}
                {genealogyData && <GenealogyTree data={genealogyData} onNodeClick={handleSearch} />}
            </main>
        </div>
    );
}
