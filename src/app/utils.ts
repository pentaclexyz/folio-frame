import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export { prisma };

// Utility functions

export function currentURL(pathname: string): URL {
    try {
        const headersList = headers();
        const host = headersList.get('x-forwarded-host') || headersList.get('host');
        const protocol = headersList.get('x-forwarded-proto') || 'http';

        return new URL(pathname, `${protocol}://${host}`);
    } catch (error) {
        console.error(error);
        return new URL('http://localhost:3000');
    }
}

export function appURL() {
    if (process.env.NEXT_PUBLIC_HOST) {
        return process.env.NEXT_PUBLIC_HOST;
    } else {
        const url = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
        console.warn(`Warning: NEXT_PUBLIC_HOST environment variable is not set. Falling back to ${url}.`);
        return url;
    }
}

export function vercelURL() {
    return process.env.NEXT_PUBLIC_HOST ? `https://${process.env.NEXT_PUBLIC_HOST}` : undefined;
}

export function createExampleURL(path: string) {
    return new URL(path, appURL()).toString();
}
