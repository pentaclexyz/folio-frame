// src/app/frames/pentacle-new/[project]/page.tsx
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata({ params }: { params: { project: string } }) {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    const metadataUrl = new URL(`/frames/pentacle-new/${params.project}/`, baseUrl);

    return {
        title: `POP – proof of project: ${params.project}`,
        other: {
            ...(await fetchMetadata(metadataUrl)),
        },
    };
}

export default function ProjectPage({ params }: { params: { project: string } }) {
    const project = params.project;

    return (
        <main className={"bg-[#f3eeda] h-screen flex flex-col justify-between"}>
            {/*<div className={"grid justify-items-end w-full pr-24"}>*/}
            {/*    <img className={"w-48 pt-8"} src={`/${project}/pop-icon.svg`} alt={`${project} icon`} />*/}
            {/*</div>*/}
            {/*<div className={"flex justify-between items-center"}>*/}
            {/*    <div className={"w-[400px]"}>*/}
            {/*        <div className={""}>*/}
            {/*            <img src={`/${project}/pop-char-small.png`} alt={`${project} character`} />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={"pr-12"}>*/}
            {/*        <div className={"w-96"}>*/}
            {/*            <img src={`/${project}/proof-of-project-soon.svg`} alt={`${project} logo`} />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {project.project_name}
        </main>
    );
}
