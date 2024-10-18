import { db } from '@lib/db/db';
import { users, projects, clients } from '@lib/db/drizzle/schema';
import { eq, getTableColumns, sql } from 'drizzle-orm';

export async function getProjectById(projectId: number) {
  return db.select().from(projects).where(eq(projects.projectId, projectId));
}

// export async function getAllProjectsByFarcasterHandle(farcasterHandle: string) {
//     return db.query.projects.findFirst({where: (users, {eq}) => eq(users, farcasterHandle)})
// }

export async function getAllProjectsByFarcasterHandle(farcasterHandle: string) {
  return db
    .select({ ...getTableColumns(projects), clients: { ...getTableColumns(clients) } })
    .from(projects)
    .leftJoin(users, eq(projects.userId, users.userId))
    .innerJoin(clients, eq(projects.clientId, clients.clientId))
    .where(eq(users.userWarpcastHandle, farcasterHandle));
}

// export async function getAllProjectsByFarcaster(farcasterHandle: string) {
//     return db.select({...getTableColumns(users), projects}).from(users).where(eq(users.userWarpcastHandle, farcasterHandle));
// }

// export async function getTotalWinsOrLosesPerPlayer(isWon: boolean) {
//   return db
//     .select({
//       player: playerLeaderboardResult.player,
//       count: sql<number>`count(case when (results->>'won')::boolean = ${isWon} then 1 end)`.as(
//         'count',
//       ),
//     })
//     .from(playerLeaderboardResult)
//     .groupBy(playerLeaderboardResult.player)
//     .orderBy(sql`count DESC`);
// }
//
// export async function getDungeonQuestGeneralStats() {
//   return db
//     .select({
//       startedDungeonQuests: sql<number>`
//       COUNT(CASE
//         WHEN ${event.eventType} = 'StartedQuest' AND ${quest.questType} = 3
//         THEN 1
//       END)`.as('started_dungeon_quests'),
//       breachDungeonFinished: sql<number>`
//       COUNT(CASE
//         WHEN ${event.eventType} = 'BreachDungeonFinished'
//         THEN 1
//       END)`.as('breach_dungeon_finished'),
//       abandonedDungeonQuests: sql<number>`
//       COUNT(CASE
//         WHEN ${event.eventType} = 'AbandonedQuest' AND ${quest.questType} = 3
//         THEN 1
//       END)`.as('abandoned_dungeon_quests'),
//     })
//     .from(event)
//     .leftJoin(quest, eq(event.questId, quest.id));
// }
//
// export async function getDungeonTotalSumsStatsByPlayer() {
//   return db
//     .select({
//       player: playerLeaderboardResult.player,
//       totalScore: sql<number>`SUM((${playerLeaderboardResult.results}->>'totalScore')::numeric)`.as(
//         'total_score',
//       ),
//       totalPlayTime:
//         sql<number>`SUM((${playerLeaderboardResult.results}->>'playTime')::numeric)`.as(
//           'total_play_time',
//         ),
//       totalWinCount: sql<number>`COUNT(*)`.as('total_win_count'),
//       totalEnemiesKilled: sql<number>`
//         SUM((
//           SELECT COALESCE(SUM((enemy->>'count')::numeric), 0)
//           FROM jsonb_array_elements(${playerLeaderboardResult.results}->'enemiesKilled') AS enemy
//         ))
//       `.as('total_enemies_killed'),
//     })
//     .from(playerLeaderboardResult)
//     .groupBy(playerLeaderboardResult.player)
//     .orderBy(sql`total_score DESC`)
//     .where(sql`(${playerLeaderboardResult.results}->>'won')::boolean = true`);
// }
