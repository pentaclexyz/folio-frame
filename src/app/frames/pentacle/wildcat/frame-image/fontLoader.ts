// fontLoader.ts
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export async function loadFonts() {
    const factorARegularFont = await fs.readFile(
        path.join(process.cwd(), "public/fonts", "FactorAMono-Regular.otf")
    );
    const factorABoldFont = await fs.readFile(
        path.join(process.cwd(), "public/fonts", "FactorAMono-Bold.otf")
    );

    return [
        {
            name: "factor-a",
            data: factorARegularFont,
            style: 'normal' as const,
            weight: 400 as const,
        },
        {
            name: "factor-a-bold",
            data: factorABoldFont,
            style: 'normal' as const,
            weight: 700 as const,
        }
    ];
}
