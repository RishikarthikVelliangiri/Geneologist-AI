'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
    targetId: string;
    fileName?: string;
}

export function ExportButton({ targetId, fileName = 'genealogy-tree' }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        setIsExporting(true);

        try {
            // Add a small delay to ensure fonts/images are ready
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toPng(element, {
                backgroundColor: '#0a0a0a', // Match background color
                pixelRatio: 2, // Higher quality
                skipAutoScale: true,
                filter: (node: Node) => {
                    // Exclude the export button itself from the capture if it's inside the container
                    if (node instanceof HTMLElement && node.tagName === 'BUTTON' && node.innerText.includes('Export')) {
                        return false;
                    }
                    return true;
                }
            });

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
            // Check if it's a CORS error (often shows as empty object or network error)
            if (error instanceof Error) {
                alert(`Export failed: ${error.message}`);
            } else {
                console.error('Unknown error object:', JSON.stringify(error));
                alert('Export failed. This is likely due to a security restriction with the external concept image. Please try again or choose a concept without an external image.');
            }
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="fixed bottom-8 right-8 lg:right-24 z-50 flex items-center gap-2 px-4 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/50 rounded-full text-neon-blue font-mono text-sm transition-all duration-300 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            {isExporting ? 'Capturing...' : 'Export Tree'}
        </button>
    );
}
