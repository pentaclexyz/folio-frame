import {fetchMetadata} from "frames.js/next";

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    const metadataUrl = new URL('/frames', baseUrl);

    return {
        title: "POP – proof of project",
        other: {
            ...(await fetchMetadata(metadataUrl)),
        },
    };
}

export default function Page() {
    return <main className={"bg-[#f3eeda] h-screen flex flex-col justify-between"}>
        <div className={"grid justify-items-end w-full pr-24"}>
            <img className={"w-48 pt-8"} src={"images/pop-icon.svg"} alt={"pop"}/>
        </div>
        <div className={"flex justify-between items-center"}>
            <div className={"w-[400px]"}>
                <div className={""}><img src={"images/pop-char-small.png"} alt={"pop"}/></div>
            </div>
            <div className={"w-96 pr-12"}><img src={"images/proof-of-project-soon.svg"} alt={"pop"}/></div>
        </div>
    </main>;
}
