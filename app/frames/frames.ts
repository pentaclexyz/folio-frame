import { createFrames } from 'frames.js/next';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { neynarValidate } from 'frames.js/middleware/neynar';

export const frames = createFrames({
  basePath: '/frames',
  // imagesRoute: '/frame-image',
  debug: process.env.NODE_ENV === 'development',
  imageRenderingOptions: async () => {
    const factorARegularFont = fs.readFile(
      path.join(path.resolve(process.cwd(), 'public'), 'FactorAMono-Regular.otf'),
    );
    const factorABoldFont = fs.readFile(
      path.join(path.resolve(process.cwd(), 'public'), 'FactorAMono-Bold.otf'),
    );
    const [factorARegularFontData, factorABoldFontData] = await Promise.all([
      factorARegularFont,
      factorABoldFont,
    ]);
    return {
      imageOptions: {
        fonts: [
          {
            name: 'Factor A',
            data: factorARegularFontData,
            weight: 400,
          },
          {
            name: 'Factor A',
            data: factorABoldFontData,
            weight: 700,
          },
        ],
      },
    };
  },
  middleware: [
    neynarValidate({
      API_KEY: process.env.NEYNAR_API_KEY || '',
    }),
  ],
});
