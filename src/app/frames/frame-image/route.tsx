import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import * as fs from "node:fs/promises";
import * as path from "node:path";

async function fetchFarcasterUserInfoByHandle(handle: string): Promise<{ pfp_url: string, fid: number, username: string }> {
    try {
        const userResponse = await fetch(`https://api.neynar.com/v1/farcaster/user-by-username?username=${handle.replace('@', '')}`, {
            headers: {
                'api_key': process.env.NEYNAR_API_KEY || ''
            }
        });
        const userData = await userResponse.json();
        const fid = userData.result.user.fid;

        return fetchFarcasterUserInfoByFid(fid);
    } catch (error) {
        console.error('Error fetching Farcaster user info by handle:', error);
        return { pfp_url: '', fid: 0, username: '' };
    }
}

async function fetchFarcasterUserInfoByFid(fid: number): Promise<{ pfp_url: string, fid: number, username: string }> {
    try {
        const infoResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
            headers: {
                'api_key': process.env.NEYNAR_API_KEY || ''
            }
        });
        const infoData = await infoResponse.json();
        return {
            pfp_url: infoData.users[0].pfp_url,
            fid: fid,
            username: infoData.users[0].username
        };
    } catch (error) {
        console.error('Error fetching Farcaster user info by FID:', error);
        return { pfp_url: '', fid: 0, username: '' };
    }
}

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;
    const backgroundColor = searchParams.get('bgcolor') || '#FDD9E8';
    const portfolioOwnerFid = 1068;
    const clientHandle = "@fileverse";

    const [portfolioOwnerInfo, clientInfo] = await Promise.all([
        fetchFarcasterUserInfoByFid(portfolioOwnerFid),
        fetchFarcasterUserInfoByHandle(clientHandle)
    ]);

    const farcasterHandle = `@${portfolioOwnerInfo.username}`;
    const projectClient = clientHandle;
    const projectTitle = "ETH Denver 2024";
    const projectDate = "September 2024";

    const teamMembers = [
        {role: "Client", handle: "fileverse"},
        {role: "PM", handle: "miroyato"},
        {role: "UX", handle: "pentacle"},
        {role: "Dev", handle: "vijay"},
    ];

    const teamMemberInfo = await Promise.all(
        teamMembers.map(member => fetchFarcasterUserInfoByHandle(member.handle))
    );

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
                    width: '100%',
                }}>
                    <div style={{
                        fontSize: '48px',
                        fontFamily: 'factor-a-bold',
                        marginBottom: '80px',
                    }}>
                        Team
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        width: '900px',
                    }}>
                        {teamMembers.map((member, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '380px',
                                marginBottom: '60px',
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    marginRight: '30px',
                                    display: 'flex',
                                }}>
                                    <img
                                        src={teamMemberInfo[index].pfp_url}
                                        alt={`${member.handle} profile`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <p style={{
                                        paddingBottom: '5px',
                                        margin: '0',
                                        fontSize: '32px',
                                        fontFamily: 'factor-a-bold',
                                    }}>{member.handle}</p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '24px',
                                        fontFamily: 'factor-a',
                                    }}>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                backgroundColor: backgroundColor,
                fontSize: 24,
                fontWeight: 600
            }}>
                {content}
            </div>
        ),
        options
    );
};
