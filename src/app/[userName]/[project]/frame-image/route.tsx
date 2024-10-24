import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { prisma } from '@/app/utils';
import { fetchFarcasterUserInfoByHandle, fetchFarcasterUserInfoByFid } from '../../farcasterApi';
import { fetchTeamMemberInfo } from '../../teamUtils';
import { getContentForState } from './contentRenderer';
import { loadFonts } from './fontLoader';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;

    // Extract the project name from the URL (assuming the 5th part of the URL is the project name)
    const project = request.nextUrl.pathname.split('/')[2];

    if (!project) {
        throw new Error('Project name not provided in the URL');
    }

    // Query the project data dynamically based on the project name
    const projectData = await prisma.projects.findFirst({
        where: {
            project_name: project  // Use the dynamically extracted project name
        },
        include: {
            clients: true,
            images: true,
            team_members_projects: {
                include: {
                    users: true,
                    roles: true
                }
            }
        }
    });

    if (!projectData) {
        throw new Error(`No data returned from query for project: ${project}`);
    }

    const portfolioOwnerFid = projectData?.team_members_projects[0]?.users?.user_fid;

    if (!portfolioOwnerFid) {
        throw new Error('No portfolio owner FID found');
    }

    const clientHandle = projectData?.clients?.client_warpcast_handle;
    const projectTitle = projectData?.project_name;
    const projectDate = projectData?.project_date;
    const imagePaths = projectData?.images?.map(image => image.image_path) ?? [];
    const teamMembers = projectData?.team_members_projects?.map(member => ({
        handle: member.users?.user_name,
        role: member.roles?.role_name
    })) ?? [];

    if (!clientHandle || !projectTitle || !projectDate) {
        throw new Error('Missing required project data');
    }

    const [portfolioOwnerInfo] = await Promise.all([
        fetchFarcasterUserInfoByFid(portfolioOwnerFid),
        fetchFarcasterUserInfoByHandle(clientHandle)
    ]);

    const farcasterHandle = `@${portfolioOwnerInfo.username}`;
    const projectClient = clientHandle;
    const teamMemberInfo = await fetchTeamMemberInfo(teamMembers);
    const backgroundColor = projectData?.background_color || '#FFFFFF';

    const content = getContentForState(
        state,
        portfolioOwnerInfo,
        teamMemberInfo,
        imageIndex,
        farcasterHandle,
        projectClient,
        projectTitle,
        projectDate,
        imagePaths,
        backgroundColor
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
