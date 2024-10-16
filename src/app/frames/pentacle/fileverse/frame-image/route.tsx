import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { fetchFarcasterUserInfoByHandle, fetchFarcasterUserInfoByFid } from '../../farcasterApi';
import { fetchTeamMemberInfo } from '../../teamUtils';
import { getContentForState } from './contentRenderer';
import { loadFonts } from './fontLoader';

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

    const imagePaths = [
        '/fileverse/folio-01.png',
        '/fileverse/folio-02.png',
        '/fileverse/folio-03.png',
    ];

    const teamMemberInfo = await fetchTeamMemberInfo(teamMembers);

    const content = getContentForState(
        state,
        portfolioOwnerInfo,
        teamMemberInfo,
        imageIndex,
        farcasterHandle,
        projectClient,
        projectTitle,
        projectDate,
        imagePaths
    );

    const fonts = await loadFonts();

    const options = {
        width: 1200,
        height: 628,
        fonts
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
