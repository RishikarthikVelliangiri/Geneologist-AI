'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchInputProps {
    onSearch: (term: string) => void;
    isLoading: boolean;
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
    const [term, setTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            onSearch(term);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Enter a concept (e.g., Stoicism, Cyberpunk, Democracy)..."
                    className="w-full bg-card/80 dark:bg-cyber-gray/80 border border-input text-foreground placeholder:text-muted-foreground rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all font-mono text-lg backdrop-blur-md"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 p-2 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue dark:text-neon-blue text-blue-600 rounded-full transition-colors disabled:opacity-50"
                >
                    <Search className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
}
