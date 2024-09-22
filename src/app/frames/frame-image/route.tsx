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
            content = <h1>Welcome to Our Project</h1>;
            break;
        case 'images':
            content = <h2>Image {imageIndex + 1} of 5</h2>;
            break;
        case 'credits':
            content = (
                <>
                    <h2>Credits</h2>
                    <p>Thank you to all contributors!</p>
                </>
            );
            break;
        case 'team':
            content = (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%', padding: '20px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Our Team</h2>
                    {teamMembers.map((member, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                            <p style={{ margin: '0', fontSize: '24px' }}>{member.role}</p>
                            <p style={{ margin: '0', fontSize: '20px' }}>{member.handle}</p>
                        </div>
                    ))}
                </div>
            );
            break;
        case 'stack':
            content = (
                <>
                    <h2>Our Tech Stack</h2>
                    <p>Details coming soon...</p>
                </>
            );
            break;
        default:
            content = <h1>Welcome</h1>;
    }

    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'yellow',
                    fontSize: 24,
                    fontWeight: 600,
                }}
            >
                {content}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
};
