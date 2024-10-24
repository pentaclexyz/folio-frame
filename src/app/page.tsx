import { fetchMetadata } from "frames.js/next";
import { prisma } from "@/app/utils";

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { project: string } }) {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    const project = params.project || 'fileverse';

    try {
        const projectData = await prisma.projects.findFirst({
            where: {
                project_name: project
            },
            include: {
                clients: true,
                images: true,
                users: true,
                team_members_projects: {
                    include: {
                        users: true,
                        roles: true
                    }
                }
            }
        });

        if (!projectData || !projectData.users?.user_name) {
            // Instead of throwing, return default metadata
            return {
                title: `POP – proof of project: ${project.charAt(0).toUpperCase() + project.slice(1)}`,
                other: {
                    // Default metadata if needed
                    'fc:frame': 'vNext',
                    'fc:frame:image': `${baseUrl}/api/og`,
                },
            };
        }

        const userName = projectData.users.user_name;
        const metadataUrl = new URL(`/frames/${userName}/${project}/`, baseUrl);

        return {
            title: `POP – proof of project: ${project.charAt(0).toUpperCase() + project.slice(1)}`,
            other: {
                ...(await fetchMetadata(metadataUrl)),
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        // Return default metadata instead of failing
        return {
            title: `POP – proof of project: ${project.charAt(0).toUpperCase() + project.slice(1)}`,
            other: {
                'fc:frame': 'vNext',
                'fc:frame:image': `${baseUrl}/api/og`,
            },
        };
    }
}

// Rest of your component remains the same
export default function Page({ params }: { params: { project: string } }) {
    const project = params.project || 'fileverse';

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
