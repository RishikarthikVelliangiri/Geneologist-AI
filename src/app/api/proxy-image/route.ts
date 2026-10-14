import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';

const MAX_BYTES = 8 * 1024 * 1024;

function isPrivateIp(ip: string) {
    return /^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|f[cd][0-9a-f]{2}:|fe80:)/i.test(ip);
}

/** Only public https hosts: this endpoint fetches arbitrary URLs, so it must not reach internal services. */
async function isPublicHttps(raw: string): Promise<URL | null> {
    try {
        const url = new URL(raw);
        if (url.protocol !== 'https:') return null;
        const ip = isIP(url.hostname) ? url.hostname : (await lookup(url.hostname)).address;
        return isPrivateIp(ip) ? null : url;
    } catch {
        return null;
    }
}

/** Serves a remote image from our own origin, so hotlink blocks and missing CORS headers don't break it (or the PNG export). */
export async function GET(request: NextRequest) {
    const url = await isPublicHttps(request.nextUrl.searchParams.get('url') ?? '');
    if (!url) return new NextResponse('Invalid URL', { status: 400 });

    try {
        const upstream = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IdeaGenealogist/1.0)', Accept: 'image/*' },
            redirect: 'error',
            signal: AbortSignal.timeout(8000),
        });
        const type = upstream.headers.get('content-type') ?? '';
        // SVG can carry scripts, so only raster images pass.
        if (!upstream.ok || !type.startsWith('image/') || type.includes('svg')) return new NextResponse('Not an image', { status: 415 });

        const body = Buffer.from(await upstream.arrayBuffer());
        if (body.length > MAX_BYTES) return new NextResponse('Too large', { status: 413 });

        return new NextResponse(body, {
            headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400, immutable' },
        });
    } catch {
        return new NextResponse('Fetch failed', { status: 502 });
    }
}
