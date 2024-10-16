import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fetchFarcasterUserInfoByHandle, fetchFarcasterUserInfoByFid } from '../../farcasterApi';
import { fetchTeamMemberInfo } from '../../teamUtils';
import { getContentForState } from './contentRenderer';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;
    const backgroundColor = searchParams.get('bgcolor') || '#FDD9E8';
    const portfolioOwnerFid = 1068;
    const clientHandle = "@fileverse";

    const [portfolioOwnerInfo] = await Promise.all([
        fetchFarcasterUserInfoByFid(portfolioOwnerFid),
        fetchFarcasterUserInfoByHandle(clientHandle)
    ]);

    const farcasterHandle = `@${portfolioOwnerInfo.username}`;
    const projectClient = clientHandle;
    const projectTitle = "ETH Denver 2024";
    const projectDate = "June 2024";

    const teamMembers = [
        { role: "Client", handle: "fileverse" },
        { role: "PM", handle: "miroyato" },
        { role: "Product design", handle: "pentacle" },
        { role: "Dev", handle: "vijay" }
    ];

    const teamMemberInfo = await fetchTeamMemberInfo(teamMembers);

    // Pass the additional variables to the content renderer
    const content = getContentForState(
        state,
        portfolioOwnerInfo,
        teamMemberInfo,
        imageIndex,
        farcasterHandle,
        projectClient,
        projectTitle,
        projectDate
    );

    const factorARegularFont = await fs.readFile(
        path.join(process.cwd(), "public/fonts", "FactorAMono-Regular.otf")
    );
    const factorABoldFont = await fs.readFile(
        path.join(process.cwd(), "public/fonts", "FactorAMono-Bold.otf")
    );

    type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

    const options = {
        width: 1200,
        height: 628,
        fonts: [
            {
                name: "factor-a",
                data: factorARegularFont,
                style: 'normal' as const,
                weight: 400 as Weight
            },
            {
                name: "factor-a-bold",
                data: factorABoldFont,
                style: 'normal' as const,
                weight: 700 as Weight
            }
        ]
    };

    return new ImageResponse(
        (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: backgroundColor,
                fontSize: 24,
                fontWeight: 600
            }}>
                {content}
            </div>
        ),
        options
    );
};
