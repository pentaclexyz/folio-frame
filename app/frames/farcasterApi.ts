// farcasterApi.ts

export async function fetchFarcasterUserInfoByHandle(handle: string): Promise<{ pfp_url: string, fid: number, username: string }> {
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

export async function fetchFarcasterUserInfoByFid(fid: number): Promise<{ pfp_url: string, fid: number, username: string }> {
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
