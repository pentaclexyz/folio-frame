import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { fetchFarcasterUserInfoByFid } from '../../farcasterApi';
import { fetchTeamMemberInfo } from '../../teamUtils';
import { loadFonts } from '../../frame-image/fontLoader';
import { serverClient } from '@/app/_trpc/server-client';
import invariant from 'tiny-invariant';
import { error } from 'frames.js/core';
import { frames } from '../../frames';
import { Button } from 'frames.js/next';

const handler = async (
  req: NextRequest,
  { params: { farcasterHandle } }: { params: { farcasterHandle: string } },
) => {
  return await frames(async (ctx) => {
    const projectIndex = ctx.searchParams.projectIndex
      ? parseInt(ctx.searchParams.projectIndex as string)
      : 0;

    const backgroundColor = ctx.searchParams.bgcolor || '#FDD9E8';
    // const portfolioOwnerFid = ctx.message?.requesterFid;
    // if (!portfolioOwnerFid) {
    //   return error('No user fid found');
    // }

    // invariant(portfolioOwnerFid);

    // const portfolioOwnerInfo = await fetchFarcasterUserInfoByFid(portfolioOwnerFid);

    const projects = await serverClient.getAllProjectsByFarcasterHandle({
      userFarcasterHandle: farcasterHandle,
      offset: projectIndex,
    });

    const firstProject = projects[0];

    if (!firstProject) {
      //TODO: Return "empty portfolio" image
      throw new Error('No project');
    }

    // const farcasterHandle = `@${farcasterHandle}`;
    const projectClient = firstProject.clients.clientWarpcastHandle;
    const projectTitle = firstProject.projectName;
    const projectDate = firstProject.projectDate;

    const teamMembers = [
      { role: 'Client', handle: 'fileverse' },
      { role: 'PM', handle: 'miroyato' },
      { role: 'Product design', handle: 'pentacle' },
      { role: 'Dev', handle: 'vijay' },
    ];

    const teamMemberInfo = await fetchTeamMemberInfo(teamMembers);

    invariant(projectClient);
    invariant(projectDate);

    const fonts = await loadFonts();

    const options = {
      width: 1200,
      height: 628,
      fonts,
    };

    const user = await serverClient.getUserByFarcasterHandle(farcasterHandle);
    if (!user) {
      return error('No user found');
    }
    const totalUserProjects = (await serverClient.getTotalUserProjects(user.userId))[0].count;
    const buttons = [
      <Button key="home" action="post" target={{ query: { projectIndex: 0 } }}>
        🏠
      </Button>,
    ];

    if (projectIndex > 0) {
      buttons.push(
        <Button key="prev" action="post" target={{ query: { projectIndex: projectIndex - 1 } }}>
          ⬅️
        </Button>,
      );
    }

    if (totalUserProjects > projectIndex + 1) {
      buttons.push(
        <Button key="next" action="post" target={{ query: { projectIndex: projectIndex + 1 } }}>
          ➡️
        </Button>,
      );
    }

    return {
      image: `${process.env.NEXT_PUBLIC_HOST}/fileverse/${firstProject.images.imagePath}.png`,
      buttons,
      title: `${farcasterHandle} Portfolio`,
    };
  })(req);
};

export const GET = handler;
export const POST = handler;
