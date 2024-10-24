import { NextRequest, NextResponse } from "next/server";  // Import NextResponse to return proper HTTP response
import { Button } from "frames.js/next";
import { initializeFrames } from "./frames";
import { prisma } from '@/app/utils';

type FrameState = 'home' | 'images' | 'team';

async function handleRequest(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const state = (searchParams.get('state') as FrameState) || 'home';
    const imageIndex = parseInt(searchParams.get('imageIndex') || '0', 10);
    const project = req.nextUrl.pathname.split('/')[3];

    console.log("Extracted project:", project);

    // Fetch project data from Prisma
    const projectData = await prisma.projects.findFirst({
        where: {
            project_name: project
        },
        include: {
            clients: true,
            images: true,
            users: true,
            team_members_projects: {
                include: {
                    users: true,
                    roles: true
                }
            }
        }
    });

    if (!projectData) {
        return NextResponse.json({ error: `Project not found: ${project}` }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const userName = projectData.users.user_name;

    // Initialize frames for the project
    await initializeFrames(project);

    const imageUrl = `${baseUrl}/frames/${userName}/${project}/frame-image?state=${state}&imageIndex=${imageIndex}`;

    const websiteUrl = projectData.website_url;
    const warpcastHandle = projectData.clients.client_warpcast_handle;
    const imageLabels = projectData.images.map(img => img.image_caption || 'View');

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                <Button key="images" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=images`}>Folio</Button>,
                <Button key="team" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=team`}>Team</Button>,
                <Button key="website" action="link" target={websiteUrl && websiteUrl.startsWith('http') ? websiteUrl : (websiteUrl ? `https://${websiteUrl}` : '#')}>View site</Button>
            ];
            break;
        case 'images':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=home`}>🏠</Button>,
                <Button key="image1" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=images&imageIndex=0`}>{imageLabels[0]}</Button>,
                <Button key="image2" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=images&imageIndex=1`}>{imageLabels[1]}</Button>,
                <Button key="image3" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=images&imageIndex=2`}>{imageLabels[2]}</Button>,
            ];
            break;
        case 'team':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=home`}>🏠</Button>,
                <Button key="warpcast" action="link" target={`https://warpcast.com/${warpcastHandle ?? ''}`}>{warpcastHandle ?? 'Warpcast'}</Button>

            ];
            break;
        default:
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/${userName}/${project}?state=home`}>🏠</Button>
            ];
    }

    // Return a JSON response with the image URL and buttons
    return NextResponse.json({
        image: imageUrl,
        buttons
    });
}

// Export the GET handler
export async function GET(req: NextRequest) {
    return handleRequest(req);
}

// Export the POST handler
export async function POST(req: NextRequest) {
    return handleRequest(req);
}
