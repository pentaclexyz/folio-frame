import { Button } from "frames.js/next";
import { frames } from "./frames";

type FrameState = 'home' | 'images' | 'credits' | 'team' | 'stack' | 'endorse';

const handleRequest = frames(async (ctx) => {
    const state = (ctx.searchParams.state as FrameState) || 'home';
    const imageIndex = parseInt(ctx.searchParams.imageIndex || '0', 10);
    const totalImages = 5;

    let buttons;
    switch (state) {
        case 'home':
            buttons = [
                <Button action="post" target={{ query: { state: 'images'} }}>Images</Button>,
                <Button action="post" target={{ query: { state: 'credits' } }}>Credits</Button>,
                <Button action="link" target="https://your-website.com">Website</Button>
            ];
            break;
        case 'images':
            buttons = [
                <Button action="post" target={{ query: { state: 'home' } }}>Home</Button>,
                <Button action="post" target={{ query: { state: 'images', imageIndex: Math.max(0, imageIndex - 1).toString() } }}>Previous</Button>,
                <Button action="post" target={{ query: { state: 'images', imageIndex: Math.min(totalImages - 1, imageIndex + 1).toString() } }}>Next</Button>,
                <Button action="link" target="https://your-website.com">Website</Button>
            ];
            break;
        case 'credits':
        case 'team':
        case 'stack':
        case 'endorse':
            buttons = [
                    <Button key="home" action="post" target={{ query: { state: 'home' } }}>Home</Button>,
                    <Button key="team" action="post" target={{ query: { state: 'team' } }}>Team</Button>,
                    <Button key="stack" action="post" target={{ query: { state: 'stack' } }}>Stack</Button>,
                    <Button key="endorse" action="post" target={{ query: { state: 'endorse' } }}>Endorse</Button>
            ];
            break;
        default:
            buttons = [
                <Button action="post" target={{ query: { state: 'home' } }}>Home</Button>
            ];
    }

    return {
        image: `${process.env.NEXT_PUBLIC_HOST}/frames/frame-image?state=${state}&imageIndex=${imageIndex}`,
        buttons: buttons,
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
