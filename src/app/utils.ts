import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

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
    if (process.env.APP_URL) {
        return process.env.APP_URL;
    } else {
        const url = process.env.APP_URL || vercelURL() || 'http://localhost:3000';
        console.warn(`Warning: APP_URL environment variable is not set. Falling back to ${url}.`);
        return url;
    }
}

export function vercelURL() {
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
}

export function createExampleURL(path: string) {
    return new URL(path, appURL()).toString();
}
