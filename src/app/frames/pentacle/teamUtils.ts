// teamUtils.ts
import { fetchFarcasterUserInfoByHandle } from './farcasterApi';

export async function fetchTeamMemberInfo(teamMembers: { role: string, handle: string }[]) {
    return Promise.all(
        teamMembers.map(member => fetchFarcasterUserInfoByHandle(member.handle))
    );
}
