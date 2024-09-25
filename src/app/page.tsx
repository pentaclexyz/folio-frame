import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
    return {
        title: "folio frame",
        other: {
            ...(await fetchMetadata(
                new URL(
                    "/frames",
                    process.env.NEXT_PUBLIC_HOST // no idea why this is like this but it works now
                        ? "https://folio-frame2.vercel.app/"
                        : "http://localhost:3000"
                )
            )),
        },
    };
}

export default function Page() {
    return <span className={"bg-pink-300 h-full p-40 flex items-center justify-items-center"}>Hello</span>;
}
