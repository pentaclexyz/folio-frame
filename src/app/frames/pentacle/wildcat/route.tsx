import { Button } from "frames.js/next";
import { frames } from "./frames";
import { prisma } from '@/app/utils';
import { fetchMetadata } from "frames.js/next";

type FrameState = 'home' | 'images' | 'team';

// Metadata generation function for the wildcat project
export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    const metadataUrl = new URL('/frames/pentacle/wildcat/', baseUrl); // Hardcoded for wildcat

    return {
        title: "POP – proof of project: Wildcat",
        other: {
            ...(await fetchMetadata(metadataUrl)),
        },
    };
}

const handleRequest = frames(async (ctx) => {
    const state = (ctx.searchParams.state as FrameState) || 'home';
    const imageIndex = parseInt(ctx.searchParams.imageIndex || '0', 10);

    // Use the singleton Prisma client to query your database
    const projectData = await prisma.projects.findFirst({
        where: {
            project_name: 'wildcat',
            user_id: 1
        },
        include: {
            clients: true,
            images: true
        }
    });

    if (!projectData) {
        throw new Error('Project not found');
    }

    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const imageUrl = `${baseUrl}/frames/pentacle/wildcat/frame-image?state=${state}&imageIndex=${imageIndex}`;

    const websiteUrl = projectData.website_url;
    const warpcastHandle = projectData.clients.client_warpcast_handle;
    const imageLabels = projectData.images.map(img => img.image_caption || 'View');

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                <Button key="images" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=images`}>Folio</Button>,
                <Button key="team" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=team`}>Team</Button>,
                <Button key="website" action="link" target={`https://${websiteUrl}`}>View site</Button>
            ];
            break;
        case 'images':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=home`}>🏠</Button>,
                <Button key="image1" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=images&imageIndex=0`}>{imageLabels[0]}</Button>,
                <Button key="image2" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=images&imageIndex=1`}>{imageLabels[1]}</Button>,
                <Button key="image3" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=images&imageIndex=2`}>{imageLabels[2]}</Button>,
            ];
            break;
        case 'team':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=home`}>🏠</Button>,
                <Button key="warpcast" action="link" target={`https://warpcast.com/${warpcastHandle}`}>{warpcastHandle}</Button>
            ];
            break;
        default:
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle/wildcat?state=home`}>🏠</Button>
            ];
    }

    return {
        image: imageUrl,
        buttons: buttons,
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
