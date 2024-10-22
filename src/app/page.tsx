import { fetchMetadata } from "frames.js/next";
import { useRouter } from 'next/router';

export async function generateMetadata({ params }) {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

    // Extract project name from params
    const project = params.project || 'wildcat';  // Default to fileverse if not specified
    const metadataUrl = new URL(`/frames/pentacle/${project}/`, baseUrl);

    return {
        title: `POP – proof of project: ${project.charAt(0).toUpperCase() + project.slice(1)}`,
        other: {
            ...(await fetchMetadata(metadataUrl)),
        },
    };
}

export default function Page() {
    const router = useRouter();
    const { project } = router.query;  // Dynamically pull the project name from the URL

    return (
        <main className={"bg-[#f3eeda] h-screen flex flex-col justify-between"}>
            <div className={"grid justify-items-end w-full pr-24"}>
                <img className={"w-48 pt-8"} src={"images/pop-icon.svg"} alt={"pop"}/>
            </div>
            <div className={"flex justify-between items-center"}>
                <div className={"w-[400px]"}>
                    <div className={""}><img src={"images/pop-char-small.png"} alt={"pop"}/></div>
                </div>
                <div className={"pr-12"}>
                    <div className={"w-96"}><img src={"images/proof-of-project-soon.svg"} alt={"pop"}/></div>
                </div>
            </div>
        </main>
    );
}
