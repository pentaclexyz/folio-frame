import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import * as fs from "node:fs/promises";
import * as path from "node:path";

async function fetchFarcasterUserInfo(fid: number): Promise<{ pfp_url: string, username: string }> {
    try {
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
            headers: {
                'api_key': process.env.NEYNAR_API_KEY || ''
            }
        });
        const data = await response.json();
        return {
            pfp_url: data.users[0].pfp_url,
            username: data.users[0].username
        };
    } catch (error) {
        console.error('Error fetching Farcaster user info:', error);
        return { pfp_url: '', username: '' };
    }
}

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;

    // Dynamic content for home state
    const portfolioOwnerFid = 1068;
    const clientFid = 243117;

    const [portfolioOwnerInfo, clientInfo] = await Promise.all([
        fetchFarcasterUserInfo(portfolioOwnerFid),
        fetchFarcasterUserInfo(clientFid)
    ]);

    const farcasterHandle = `${portfolioOwnerInfo.username}`;
    const projectClient = `${clientInfo.username}`;
    const projectTitle = "ETH Denver 2024";
    const projectDate = "June 2024";

    const teamMembers = [
        {role: "Made for", handle: "fileverse"},
        {role: "PM", handle: "miroyato"},
        {role: "UX", handle: "pentacle"},
        {role: "Dev", handle: "vijay"},
    ];

    const imagePaths = [
        '/fileverse/folio-01.png',
        '/fileverse/folio-02.png',
        '/fileverse/folio-03.png',
    ];

    let content;
    let imageSrc = `${process.env.NEXT_PUBLIC_HOST}/pentacle-folio.jpg`;

    switch (state) {
        case 'home':
            content = (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        left: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            display: 'flex'
                        }}>
                            <img
                                src={portfolioOwnerInfo.pfp_url}
                                alt="Profile Picture"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div style={{
                            fontSize: '24px',
                            fontFamily: 'factor-a-bold',
                            display: 'flex'
                        }}>
                            {farcasterHandle} folio
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            width: '50%',
                            height: '100%',
                            position: 'relative',
                            paddingLeft: '50px'
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontFamily: 'factor-a-bold',
                                marginBottom: '10px',
                                display: 'flex'
                            }}>
                                {projectClient}
                            </div>
                            <div style={{
                                fontSize: '48px',
                                fontFamily: 'factor-a-bold',
                                marginBottom: '40px',
                                display: 'flex'
                            }}>
                                {projectTitle}
                            </div>
                            <div style={{
                                fontSize: '24px',
                                fontFamily: 'factor-a',
                                display: 'flex'
                            }}>
                                {projectDate}
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '50%',
                            height: '100%',
                            position: 'relative'
                        }}>
                            <div style={{
                                display: 'flex',
                                width: '400px',
                                height: '400px',
                                borderRadius: '50%',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={imageSrc}
                                    alt="Project Image"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
            break;
        case 'images':
            imageSrc = `${process.env.NEXT_PUBLIC_HOST}${imagePaths[imageIndex]}`;
            content = (
                <img
                    src={imageSrc}
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    alt={`Image ${imageIndex + 1}`}
                />
            );
            break;
        case 'team':
            content = (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '48px',
                        fontFamily: 'factor-a-bold',
                        marginBottom: '80px',
                        display: 'flex'
                    }}>
                        Contributors
                    </div>
                    {teamMembers.map((member, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '60%',
                            marginBottom: '10px',
                        }}>
                            <p style={{
                                margin: 0,
                                textAlign: 'left',
                                fontSize: '32px',
                                marginRight: '20px',
                                flex: '1',
                                fontFamily: 'factor-a'
                            }}>{member.role}</p>
                            <p style={{
                                margin: 0,
                                fontWeight: 700,
                                textAlign: 'left',
                                fontSize: '32px',
                                flexBasis: 'auto',
                                fontFamily: 'factor-a'
                            }}>{member.handle}</p>
                        </div>
                    ))}
                </div>
            );
            break;
        case 'stack':
            content = (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}>
                    <h2 style={{fontFamily: 'factor-a-bold'}}>Our Tech Stack</h2>
                    <p style={{fontFamily: 'factor-a'}}>Details coming soon...</p>
                </div>
            );
            break;
        default:
            content = (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <h1 style={{fontFamily: 'factor-a'}}>Welcome</h1>
                </div>
            );
    }

    const factorARegularFont = await fs.readFile(
        path.join(process.cwd(), "public/fonts", "FactorAMono-Regular.otf")
    );
    const factorABoldFont = await fs.readFile(
        path.join(process.cwd(), "public/fonts", "FactorAMono-Bold.otf")
    );

    type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

    const options = {
        width: 1200,
        height: 628,
        fonts: [
            {
                name: "factor-a",
                data: factorARegularFont,
                style: 'normal' as const,
                weight: 400 as Weight
            },
            {
                name: "factor-a-bold",
                data: factorABoldFont,
                style: 'normal' as const,
                weight: 700 as Weight
            }
        ]
    };

    return new ImageResponse(
        (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: '#FDD9E8',
                fontSize: 24,
                fontWeight: 600
            }}>
                {content}
            </div>
        ),
        options
    );
};
