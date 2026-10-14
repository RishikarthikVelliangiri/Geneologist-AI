'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PlateProps {
    src?: string;
    alt: string;
    className?: string;
    priority?: boolean;
}

/** Wikimedia sends CORS headers; everything else is routed through our proxy so hotlink blocks and the PNG export can't break it. */
function displaySrc(src: string) {
    const host = new URL(src).hostname;
    return host.endsWith('wikimedia.org') ? src : `/api/proxy-image?url=${encodeURIComponent(src)}`;
}

/** A framed image. With no source, or if it fails to load, shows a typographic monogram instead of a hole. */
export function Plate({ src, alt, className, priority }: PlateProps) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                role="img"
                aria-label={alt}
                className={cn('flex items-center justify-center bg-plate text-muted-foreground/70 font-display text-5xl select-none', className)}
            >
                {alt.trim().charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={displaySrc(src)}
            alt={alt}
            // CORS-enabled so html-to-image can embed it in the exported PNG.
            crossOrigin="anonymous"
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
            className={cn('bg-plate object-cover', className)}
        />
    );
}
