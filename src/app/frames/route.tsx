import { Button } from "frames.js/next";
import { frames } from "./frames";

type FrameState = 'home' | 'images' | 'credits' | 'team' | 'stack' | 'endorse';

const handleRequest = frames(async (ctx) => {
    const state = (ctx.searchParams.state as FrameState) || 'home';
    const imageIndex = parseInt(ctx.searchParams.imageIndex || '0', 10);
    const totalImages = 3; // Changed to 3 as per the new requirement

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                <Button key="images" action="post" target={{ query: { state: 'images'} }}>Folio</Button>,
                <Button key="team" action="post" target={{ query: { state: 'team' } }}>Team</Button>,
                <Button key="website" action="link" target="https://ethdenver.fileverse.io">View site</Button>
            ];
            break;
        case 'images':
            buttons = [
                <Button key="home" action="post" target={{ query: { state: 'home' } }}>🏠</Button>,
                <Button key="image1" action="post" target={{ query: { state: 'images', imageIndex: '0' } }}>Schedule</Button>,
                <Button key="image2" action="post" target={{ query: { state: 'images', imageIndex: '1' } }}>Onchain love</Button>,
                <Button key="image3" action="post" target={{ query: { state: 'images', imageIndex: '2' } }}>Leaderboard</Button>,
            ];
            break;
        case 'credits':
        case 'team':
        case 'stack':
        case 'endorse':
            buttons = [
                <Button key="home" action="post" target={{ query: { state: 'home' } }}>🏠</Button>,
                // <Button key="team" action="post" target={{ query: { state: 'team' } }}>Team</Button>,
                <Button key="website" action="link" target="https://warpcast.com/fileverse">fileverse</Button>
                // <Button key="stack" action="post" target={{ query: { state: 'stack' } }}>Stack</Button>,
                // <Button key="endorse" action="post" target={{ query: { state: 'endorse' } }}>Endorse</Button>
            ];
            break;
        default:
            buttons = [
                <Button key="home" action="post" target={{ query: { state: 'home' } }}>🏠</Button>
            ];
    }

    return {
        image: `${process.env.NEXT_PUBLIC_HOST}/frames/frame-image?state=${state}&imageIndex=${imageIndex}`,
        buttons: buttons,
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
