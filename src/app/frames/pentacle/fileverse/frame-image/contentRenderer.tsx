// contentRenderer.ts

export function getContentForState(
    state: string,
    portfolioOwnerInfo: { pfp_url: string, username: string },
    teamMemberInfo: Array<{ pfp_url: string, username: string, role: string }>,
    imageIndex: number,
    farcasterHandle: string,
    projectClient: string,
    projectName: string,
    projectDate: string,
    imagePaths: string[]
) {

    console.log({
        portfolioOwnerInfo,
        teamMemberInfo,
        imagePaths,
        farcasterHandle,
        projectClient,
        projectName,
        projectDate
    });
    console.log(`http://localhost:3000/${projectClient}/${imagePaths[imageIndex]}.png`);
    console.log('Farcaster Handle:', farcasterHandle);


    switch (state) {
        case 'home':
            return (
                <div id='home' style={{
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
                                // src={portfolioOwnerInfo.pfp_url}
                                src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7bf93ea6-db04-4ac3-3373-4795beb01b00/original"
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
                                {projectName}
                            </div>

                            <div style={{
                                fontSize: '24px',
                                fontFamily: 'factor-a',
                                display: 'flex'
                            }}>
                                {/*{projectDate}*/}
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
                                    src={`${process.env.NEXT_PUBLIC_HOST}/pentacle-folio.jpg`}
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

        case 'images':
            return (
                imagePaths?.[imageIndex] ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_HOST}/${imagePaths[imageIndex]}.png`}
                        alt={`Image ${imageIndex + 1}`}
                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    />

                ) : (
                    <div style={{
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <p>No image available</p>
                    </div>
                )
            );
        case 'team':
            // Remove duplicate team members based on username
            const uniqueTeamMembers = teamMemberInfo.filter((member, index, self) =>
                index === self.findIndex((m) => m.username === member.username)
            );

            return (
                <div id={"team"} style={{
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
                        {uniqueTeamMembers.length > 0 ? (
                            uniqueTeamMembers.map((member, index) => (
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
                                            src={member.pfp_url}
                                            alt={`${member.username} profile`}
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
                                        }}>{member.username}</p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '24px',
                                            fontFamily: 'factor-a',
                                        }}>{member.role}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No team members available</p>
                        )}
                    </div>
                </div>
            );
    }
}
