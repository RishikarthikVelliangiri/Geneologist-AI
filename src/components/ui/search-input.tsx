'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    onSearch: (term: string) => void;
    isLoading: boolean;
    compact?: boolean;
}

export function SearchInput({ onSearch, isLoading, compact }: SearchInputProps) {
    const [term, setTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) onSearch(term.trim());
    };

    return (
        <form onSubmit={handleSubmit} role="search" className="w-full">
            <label htmlFor="concept" className="sr-only">Concept to trace</label>
            <div className="flex items-end gap-4 border-b border-foreground focus-within:border-accent transition-colors">
                <input
                    id="concept"
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Stoicism, democracy, impressionism"
                    autoComplete="off"
                    disabled={isLoading}
                    className={cn(
                        'min-w-0 flex-1 bg-transparent font-display placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-60',
                        compact ? 'py-2 text-2xl' : 'py-3 text-3xl md:text-4xl'
                    )}
                />
                <button
                    type="submit"
                    disabled={isLoading || !term.trim()}
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-foreground hover:text-accent transition-colors disabled:opacity-40 disabled:hover:text-foreground"
                >
                    Trace
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
            </div>
        </form>
    );
}
