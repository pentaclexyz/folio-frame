// folio-frame/src/app/scripts/updateFids.ts

import { PrismaClient } from '@prisma/client'
import { fetchFarcasterUserInfoByHandle } from '../frames/pentacle/farcasterApi'

const prisma = new PrismaClient()

async function updateUserFids() {
    try {
        const users = await prisma.users.findMany({
            where: {
                user_warpcast_handle: {
                    not: null
                }
            },
            select: {
                user_id: true,
                user_name: true,
                user_warpcast_handle: true
            }
        });

        console.log(`Found ${users.length} users to update`);

        for (const user of users) {
            if (user.user_warpcast_handle) {
                try {
                    console.log(`Fetching FID for ${user.user_name}...`);
                    const farcasterInfo = await fetchFarcasterUserInfoByHandle(user.user_warpcast_handle);

                    if (farcasterInfo.fid !== 0) {
                        await prisma.users.update({
                            where: { user_id: user.user_id },
                            data: { user_fid: farcasterInfo.fid }
                        });
                        console.log(`✅ Updated FID for ${user.user_name}: ${farcasterInfo.fid}`);
                    } else {
                        console.log(`❌ Could not fetch FID for ${user.user_name}`);
                    }
                } catch (error) {
                    console.error(`Error updating FID for ${user.user_name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Script error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateUserFids()
    .then(() => console.log('Done updating FIDs'))
    .catch(console.error);
