// teamUtils.ts
import { fetchFarcasterUserInfoByHandle } from './farcasterApi';

export async function fetchTeamMemberInfo(teamMembers: { role: string, handle: string }[]) {
    const teamMemberData = await Promise.all(
        teamMembers.map(async member => {
            const farcasterData = await fetchFarcasterUserInfoByHandle(member.handle);
            return {
                ...farcasterData,  // Combine Farcaster data
                role: member.role  // Keep the role information
            };
        })
    );

    // Filter out any duplicates based on username or handle
    const uniqueTeamMembers = teamMemberData.filter((member, index, self) =>
        index === self.findIndex((m) => m.username === member.username)
    );

    return uniqueTeamMembers;
}
