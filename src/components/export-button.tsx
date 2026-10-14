'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Loader2 } from 'lucide-react';
import { REVEAL_ALL } from './reveal';

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
            // Make every scroll-revealed block visible, and let the animation settle.
            window.dispatchEvent(new Event(REVEAL_ALL));
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const dataUrl = await toPng(element, {
                backgroundColor: getComputedStyle(document.body).backgroundColor,
                pixelRatio: 2,
                skipAutoScale: true,
                filter: (node) => !(node instanceof HTMLElement && node.dataset.exportIgnore !== undefined),
            });

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Some images may block being captured; please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            data-export-ignore
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors disabled:opacity-50"
        >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : <Download className="h-4 w-4" strokeWidth={1.75} />}
            {isExporting ? 'Rendering…' : 'Save as image'}
        </button>
    );
}
