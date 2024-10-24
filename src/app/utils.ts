import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

// Singleton pattern for Prisma client
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export { prisma };

// Utility functions
export function currentURL(pathname: string): URL {
    try {
        const headersList = headers();
        const host = headersList.get('x-forwarded-host') || 'localhost';
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
    return process.env.NEXT_PUBLIC_HOST ? `https://${process.env.NEXT_PUBLIC_HOST}` : undefined;
}

export function createExampleURL(path: string) {
    return new URL(path, appURL()).toString();
}
