import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    const metadataUrl = new URL('/frames', baseUrl);

    return {
        title: "folio frame",
        other: {
            ...(await fetchMetadata(metadataUrl)),
        },
    };
}

export default function Page() {
    return <span>Hello</span>;
}
