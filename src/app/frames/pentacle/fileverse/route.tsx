import { Button } from "frames.js/next";
import { frames } from "./frames";
import { websiteUrl, warpcastHandle, imageLabels } from './constants';

type FrameState = 'home' | 'images' | 'team';

const handleRequest = frames(async (ctx) => {
    const state = (ctx.searchParams.state as FrameState) || 'home';
    const imageIndex = parseInt(ctx.searchParams.imageIndex || '0', 10);

    const baseUrl = 'https://folio-frame-staging.up.railway.app';
    const imageUrl = `${baseUrl}/frames/pentacle/fileverse/frame-image?state=${state}&imageIndex=${imageIndex}`;

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                <Button key="images" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=images`}>Folio</Button>,
                <Button key="team" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=team`}>Team</Button>,
                <Button key="website" action="link" target={`https://${websiteUrl}`}>View site</Button>
            ];
            break;
        case 'images':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=home`}>🏠</Button>,
                <Button key="image1" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=images&imageIndex=0`}>{imageLabels[0]}</Button>,
                <Button key="image2" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=images&imageIndex=1`}>{imageLabels[1]}</Button>,
                <Button key="image3" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=images&imageIndex=2`}>{imageLabels[2]}</Button>,
            ];
            break;
        case 'team':
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=home`}>🏠</Button>,
                <Button key="warpcast" action="link" target={`https://warpcast.com/${warpcastHandle}`}>{warpcastHandle}</Button>
            ];
            break;
        default:
            buttons = [
                <Button key="home" action="post" target={`${baseUrl}/frames/pentacle/fileverse?state=home`}>🏠</Button>
            ];
    }

    return {
        image: imageUrl,
        buttons: buttons,
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
