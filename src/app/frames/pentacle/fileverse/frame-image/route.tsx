import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { PrismaClient } from '@prisma/client';
import { fetchFarcasterUserInfoByHandle, fetchFarcasterUserInfoByFid } from '../../farcasterApi';
import { fetchTeamMemberInfo } from '../../teamUtils';
import { getContentForState } from './contentRenderer';
import { loadFonts } from './fontLoader';

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;
    const backgroundColor = searchParams.get('bgcolor') || '#FDD9E8';

    const projectData = await prisma.projects.findFirst({
        where: {
            project_name: 'ETH Denver 2024'
        },
        include: {
            clients: true,
            images: true,
            team_members_projects: {
                include: {
                    users: {
                        select: {
                            user_id: true,
                            user_name: true,
                            user_fid: true
                        }
                    },
                    roles: true
                }
            }
        }
    });

    console.log('Project Data:', JSON.stringify(projectData, null, 2));

    if (!projectData) {
        throw new Error('No data returned from query');
    }

    const portfolioOwnerFid = projectData.team_members_projects[0]?.users?.user_fid;
    const clientHandle = projectData.clients.client_warpcast_handle;
    const projectTitle = projectData.project_name;
    const projectDate = projectData.project_date;
    const imagePaths = projectData.images.map(image => image.image_path);
    const teamMembers = projectData.team_members_projects.map(member => ({
        handle: member.users.user_name,
        role: member.roles.role_name
    }));

    // Add null checks
    if (!portfolioOwnerFid) {
        throw new Error('No portfolio owner FID found');
    }

    if (!clientHandle) {
        throw new Error('No client handle found');
    }

    // Fetch Farcaster user info based on the FID and client handle
    const [portfolioOwnerInfo] = await Promise.all([
        fetchFarcasterUserInfoByFid(portfolioOwnerFid),
        fetchFarcasterUserInfoByHandle(clientHandle)
    ]);

    const farcasterHandle = `@${portfolioOwnerInfo.username}`;
    const projectClient = clientHandle;

    console.log('Team Members Input:', teamMembers);  // Log input before fetching

    // Fetch additional team member info
    const teamMemberInfo = await fetchTeamMemberInfo(teamMembers);

    // Get content for the state
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

    // Load fonts
    const fonts = await loadFonts();

    // Options for the ImageResponse
    const options = {
        width: 1200,
        height: 628,
        fonts
    };

    console.log('Content:', content);

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
