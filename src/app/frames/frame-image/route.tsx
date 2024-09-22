import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = parseInt(searchParams.get('imageIndex') || '0', 10);

    const teamMembers = [
        { role: "Made for", handle: "@fileverse" },
        { role: "PM", handle: "@constantin" },
        { role: "UX", handle: "@pentacle" },
        { role: "Dev", handle: "@vijay" },
    ];

    let content;
    switch (state) {
        case 'home':
            content = <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h1>Welcome to Our Project</h1></div>;
            break;
        case 'images':
            content = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Image {imageIndex + 1} of 5</h2>
                    <p>Image content here</p>
                </div>
            );
            break;
        case 'credits':
            content = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Credits</h2>
                    <p>Thank you to all contributors!</p>
                </div>
            );
            break;
        case 'team':
            content = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Our Team</h2>
                    {teamMembers.map((member, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <p style={{ margin: 0 }}>{member.role}</p>
                            <p style={{ margin: 0 }}>{member.handle}</p>
                        </div>
                    ))}
                </div>
            );
            break;
        case 'stack':
            content = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Our Tech Stack</h2>
                    <p>Details coming soon...</p>
                </div>
            );
            break;
        default:
            content = <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h1>Welcome</h1></div>;
    }

    return new ImageResponse(
        (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'yellow', fontSize: 24, fontWeight: 600 }}>
                {content}
            </div>
        ),
        {
            width: 1200,
            height: 628,
        }
    );
};
