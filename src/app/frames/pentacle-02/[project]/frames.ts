import { createFrames } from "frames.js/next";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// Dynamic project handling
export const frames = createFrames({
    // Use dynamic basePath based on the current project
    basePath: (ctx) => `/frames/pentacle-02/${ctx.request.nextUrl.pathname.split('/')[3]}`,
    imagesRoute: (ctx) => `/frames/pentacle-02/${ctx.request.nextUrl.pathname.split('/')[3]}/frame-image`,
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
