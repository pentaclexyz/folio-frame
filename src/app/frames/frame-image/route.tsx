import {NextRequest} from 'next/server';
import {ImageResponse} from 'next/og';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'home';
    const imageIndex = searchParams.get('imageIndex') ? parseInt(searchParams.get('imageIndex') as string) : 0;

    const teamMembers = [
        {role: "Made for", handle: "@fileverse"},
        {role: "PM", handle: "@miroyato"},
        {role: "UX", handle: "@pentacle"},
        {role: "Dev", handle: "@vijay"},
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}>
                    <img
                        src={imageSrc}
                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                        alt="Fileverse at ETH Denver"
                    />
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
                    <h2>Contributors</h2>
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
                                flex: '1'
                            }}>{member.role}</p>
                            <p style={{
                                margin: 0,
                                fontWeight: '700',
                                textAlign: 'left',
                                fontSize: '32px',
                                flexBasis: 'auto'
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
                    <h2>Our Tech Stack</h2>
                    <p>Details coming soon...</p>
                </div>
            );
            break;
        default:
            content = <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <h1>Welcome</h1></div>;
    }

    return new ImageResponse(
        (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: 'yellow',
                fontSize: 24,
                fontWeight: 600
            }}>
                {content}
            </div>
        ),
        {
            width: 1200,
            height: 628,
        }
    );
};
