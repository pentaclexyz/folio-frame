import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils';

type FrameState = 'home' | 'images' | 'team';

const handleRequest = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = (searchParams.get('state') as FrameState) || 'home';
    const imageIndex = parseInt(searchParams.get('imageIndex') || '0', 10);

    const project = request.nextUrl.pathname.split('/')[3];  // Extract project name from URL

    const projectData = await prisma.projects.findFirst({
        where: {
            project_name: project,
            user_id: 1
        },
        include: {
            clients: true,
            images: true
        }
    });

    if (!projectData) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const imageUrl = `${baseUrl}/frames/${project}/frame-image?state=${state}&imageIndex=${imageIndex}`;

    const websiteUrl = projectData.website_url;
    const warpcastHandle = projectData.clients.client_warpcast_handle;
    const imageLabels = projectData.images.map(img => img.image_caption || 'View');

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                { key: "images", action: "post", target: `${baseUrl}/frames/${project}?state=images`, label: 'Folio' },
                { key: "team", action: "post", target: `${baseUrl}/frames/${project}?state=team`, label: 'Team' },
                { key: "website", action: "link", target: `https://${websiteUrl}`, label: 'View site' }
            ];
            break;
        case 'images':
            buttons = [
                { key: "home", action: "post", target: `${baseUrl}/frames/${project}?state=home`, label: '🏠' },
                { key: "image1", action: "post", target: `${baseUrl}/frames/${project}?state=images&imageIndex=0`, label: imageLabels[0] },
                { key: "image2", action: "post", target: `${baseUrl}/frames/${project}?state=images&imageIndex=1`, label: imageLabels[1] },
                { key: "image3", action: "post", target: `${baseUrl}/frames/${project}?state=images&imageIndex=2`, label: imageLabels[2] }
            ];
            break;
        case 'team':
            buttons = [
                { key: "home", action: "post", target: `${baseUrl}/frames/${project}?state=home`, label: '🏠' },
                { key: "warpcast", action: "link", target: `https://warpcast.com/${warpcastHandle}`, label: warpcastHandle }
            ];
            break;
        default:
            buttons = [
                { key: "home", action: "post", target: `${baseUrl}/frames/${project}?state=home`, label: '🏠' }
            ];
    }

    return NextResponse.json({
        image: imageUrl,
        buttons: buttons,
    });
};

export const GET = handleRequest;
export const POST = handleRequest;
