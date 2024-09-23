import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
    return {
        title: "My page",
        other: {
            ...(await fetchMetadata(
                new URL(
                    "/frames",
                    process.env.NEXT_PUBLIC_HOST // no idea why this is like this but it works now
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
