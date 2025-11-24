'use client';

import { useState } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { GenealogyTree } from '@/components/genealogy-tree';
import { LoadingState } from '@/components/loading-state';
import { generateGenealogy } from './actions';
import { GenealogyData } from '@/types';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
    const [genealogyData, setGenealogyData] = useState<GenealogyData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (concept: string) => {
        setLoading(true);
        setGenealogyData(null);

        try {
            const result = await generateGenealogy(concept);

            if (result.success && result.data) {
                setGenealogyData(result.data);
            } else {
                console.error('Error generating genealogy:', result.error);
                alert(result.error || 'Failed to generate genealogy. Please try again.');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNodeClick = async (term: string) => {
        await handleSearch(term);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated background grid */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />

            {/* Theme toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-20 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue bg-[length:200%_auto] animate-gradient tracking-tight">
                        The Idea Genealogist
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light max-w-2xl mx-auto">
                        Trace the intellectual ancestry of any concept through time
                    </p>
                    <SearchInput onSearch={handleSearch} isLoading={loading} />
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 pb-20">
                {loading ? (
                    <LoadingState />
                ) : genealogyData ? (
                    <GenealogyTree data={genealogyData} onNodeClick={handleNodeClick} />
                ) : (
                    <div className="text-center py-20 px-4">
                        <p className="text-muted-foreground text-lg">
                            Enter a concept above to explore its genealogy
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
