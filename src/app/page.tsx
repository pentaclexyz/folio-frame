import { fetchMetadata } from "frames.js/next";
// import { useSearchParams } from 'next/navigation';

export async function generateMetadata({ params }: { params: { project: string } }) {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

    // Dynamically use the project name from the URL parameters
    const project = params.project || 'fileverse';  // Fallback to fileverse if project isn't specified
    const metadataUrl = new URL(`/frames/pentacle-02/${project}/`, baseUrl);

    return {
        title: `POP – proof of project: ${project.charAt(0).toUpperCase() + project.slice(1)}`,
        other: {
            ...(await fetchMetadata(metadataUrl)),
        },
    };
}

export default function Page({ params }: { params: { project: string } }) {
    const project = params.project || 'fileverse';  // Fallback to fileverse

    return (
        <main className={"bg-[#f3eeda] h-screen flex flex-col justify-between"}>
            <div className={"grid justify-items-end w-full pr-24"}>
                <img className={"w-48 pt-8"} src={`images/pop-icon.svg`} alt={"pop"} />
            </div>
            <div className={"flex justify-between items-center"}>
                <div className={"w-[400px]"}>
                    <div className={""}>
                        <img src={`/${project}/pop-char-small.png`} alt={`${project} character`} />
                    </div>
                </div>
                <div className={"pr-12"}>
                    <div className={"w-96"}>
                        <img src={`/${project}/proof-of-project-soon.svg`} alt={`${project} logo`} />
                    </div>
                </div>
            </div>
        </main>
    );
}
