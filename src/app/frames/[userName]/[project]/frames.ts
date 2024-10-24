import { createFrames } from "frames.js/next";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { prisma } from '@/app/utils';  // Assuming Prisma is imported for database queries

export const frames = createFrames({
    // Use dynamic basePath based on the portfolio owner's user_id
    basePath: async (ctx) => {
        const project = ctx.request.nextUrl.pathname.split('/')[3];
        const projectData = await prisma.projects.findFirst({
            where: {
                project_name: project  // Use the dynamically extracted project name
            },
            include: {
                clients: true,
                images: true,
                users: true,  // Make sure to include the users relation
                team_members_projects: {
                    include: {
                        users: true,
                        roles: true
                    }
                }
            }
        });

        const userName = projectData.users.user_name;
        return `/frames/${userName}/${project}`;
    },

    imagesRoute: async (ctx) => {
        const project = ctx.request.nextUrl.pathname.split('/')[3];
        const projectData = await prisma.projects.findFirst({
            where: {
                project_name: project  // Use the dynamically extracted project name
            },
            include: {
                clients: true,
                images: true,
                users: true,  // Make sure to include the users relation
                team_members_projects: {
                    include: {
                        users: true,
                        roles: true
                    }
                }
            }
        });

        const userName = projectData.users.user_name;
        return `/frames/${userName}/${project}/frame-image`;
    },

    debug: process.env.NODE_ENV === "development",

    imageRenderingOptions: async () => {
        const factorARegularFont = fs.readFile(
            path.join(path.resolve(process.cwd(), "public"), "FactorAMono-Regular.otf")
        );
        const factorABoldFont = fs.readFile(
            path.join(
                path.resolve(process.cwd(), "public"), "FactorAMono-Bold.otf")
        );
        const [factorARegularFontData, factorABoldFontData] = await Promise.all([factorARegularFont, factorABoldFont]);
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
