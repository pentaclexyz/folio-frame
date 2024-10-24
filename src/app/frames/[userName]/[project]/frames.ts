import { createFrames } from "frames.js/next";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { prisma } from '@/app/utils';

export async function getBasePath(project: string) {
    const projectData = await prisma.projects.findFirst({
        where: { project_name: project },
        include: { users: true }
    });

    if (!projectData || !projectData.users) {
        throw new Error('Project or user not found');
    }

    const userName = projectData.users.user_name;
    return `/frames/${userName}/${project}`;
}

export async function createFrameInstance(project: string) {
    const basePath = await getBasePath(project);

    return createFrames({
        basePath,
        imagesRoute: `${basePath}/frame-image`,
        debug: process.env.NODE_ENV === "development",
        imageRenderingOptions: async () => {
            const factorARegularFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "FactorAMono-Regular.otf")
            );
            const factorABoldFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "FactorAMono-Bold.otf")
            );
            const [factorARegularFontData, factorABoldFontData] =
                await Promise.all([factorARegularFont, factorABoldFont]);
            return {
                imageOptions: {
                    fonts: [
                        {
                            name: "Factor A",
                            data: factorARegularFontData,
                            weight: 400,
                        },
                        {
                            name: "Factor A",
                            data: factorABoldFontData,
                            weight: 700,
                        },
                    ],
                },
            };
        },
    });
}
