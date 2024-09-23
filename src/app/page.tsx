import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
    return {
        title: "My page",
        other: {
            // ...
            ...(await fetchMetadata(
                // provide full URL to your /frames endpoint
                new URL(
                    "/frames",
                    process.env.VERCEL_URL
                        ? "https://folio-frame.vercel.app/"
                        : "http://localhost:3000"
                )
            )),
        },
    };
}

export default function Page() {
    return <span>Hello</span>;
}
