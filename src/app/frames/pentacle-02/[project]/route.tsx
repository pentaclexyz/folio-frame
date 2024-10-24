import { Button } from "frames.js/next";
import { frames } from "./frames";
import { prisma } from '@/app/utils';

type FrameState = 'home' | 'images' | 'team';

const handleRequest = frames(async (ctx) => {
    const state = (ctx.searchParams.state as FrameState) || 'home';
    const imageIndex = parseInt(ctx.searchParams.imageIndex || '0', 10);

    const project = ctx.url.pathname.split('/')[3];

    console.log("Extracted project:", project);

    const projectData = await prisma.projects.findFirst({
        where: {
            project_name: project,
        },
        include: {
            clients: true,
            images: true,
        }
    });

    if (!projectData) {
        throw new Error(`Project not found: ${project}`);
    }

    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const imageUrl = `${baseUrl}/frames/pentacle-02/${project}/frame-image?state=${state}&imageIndex=${imageIndex}`;

    const websiteUrl = projectData.website_url;
    const warpcastHandle = projectData.clients.client_warpcast_handle;
    const imageLabels = projectData.images.map(img => img.image_caption || 'View');

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                <Button key="images" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=images`}>Folio</Button>,
                <Button key="team" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=team`}>Team</Button>,
                <Button key="website" action="link" target={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}>View site</Button>

            ];
            break;
        case 'images':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=home`}>🏠</Button>,
                <Button key="image1" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=images&imageIndex=0`}>{imageLabels[0]}</Button>,
                <Button key="image2" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=images&imageIndex=1`}>{imageLabels[1]}</Button>,
                <Button key="image3" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=images&imageIndex=2`}>{imageLabels[2]}</Button>,
            ];
            break;
        case 'team':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=home`}>🏠</Button>,
                <Button key="warpcast" action="link" target={`https://warpcast.com/${warpcastHandle}`}>{warpcastHandle}</Button>
            ];
            break;
        default:
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle-02/${project}?state=home`}>🏠</Button>
            ];
    }

    return {
        image: imageUrl,
        buttons: buttons,
    };
});

export const GET = handleRequest;
export const POST = handleRequest;

