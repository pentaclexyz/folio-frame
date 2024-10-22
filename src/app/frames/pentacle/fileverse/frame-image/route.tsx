// src/app/frames/pentacle/fileverse/frame-image/route.tsx

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import db from '../../../../db';  // Import your db.js file
import { fetchFarcasterUserInfoByHandle, fetchFarcasterUserInfoByFid } from '../../farcasterApi';
import { fetchTeamMemberInfo } from '../../teamUtils';
import { getContentForState } from './contentRenderer';
import { loadFonts } from './fontLoader';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;
    const backgroundColor = searchParams.get('bgcolor') || '#FDD9E8';

    const res = await db.query(
        `SELECT tm.user_fid, c.client_warpcast_handle, p.project_name, p.project_date, i.image_path,
       tm.user_name as team_member_handle, r.role_name as team_member_role
FROM projects p
JOIN users u ON u.user_id = p.user_id  -- Project owner
JOIN clients c ON c.client_id = p.client_id
JOIN images i ON i.project_id = p.project_id
JOIN team_members_projects tmp ON tmp.project_id = p.project_id
JOIN users tm ON tm.user_id = tmp.team_member_id  -- Team members
JOIN roles r ON r.role_id = tmp.role_id
WHERE p.project_name = $1 AND c.client_warpcast_handle = $2;
`,
        ['ETH Denver', 'fileverse']
    );

// Handle the query result
    if (res.rows.length === 0) {
        throw new Error('No data returned from query');
    }

    const projectData = res.rows[0];

    const portfolioOwnerFid = projectData.user_fid;
    const clientHandle = projectData.client_warpcast_handle;
    const projectTitle = projectData.project_name;
    const projectDate = projectData.project_date;
    const imagePaths = res.rows.map(row => row.image_path);
    const teamMembers = res.rows.map(row => ({ handle: row.team_member_handle, role: row.team_member_role }));


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
