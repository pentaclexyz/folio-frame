import { Button } from 'frames.js/next';
import { frames } from './frames';
import { websiteUrl, warpcastHandle, imageLabels } from './frame-image/route';
import { error } from 'frames.js/core';
import { fetchFarcasterUserInfoByFid } from '@/app/frames/farcasterApi';
import { serverClient } from '@/app/_trpc/server-client';
import { getUserByFarcasterHandle } from '@lib/db/queries/pop';

type FrameState = 'home' | 'portfolio' | 'team';

const handleRequest = frames(async (ctx) => {
  const state = (ctx.searchParams.state as FrameState) || 'home';

  const imageIndex = parseInt(ctx.searchParams.imageIndex || '0', 10);

  let imageUrl = `${process.env.NEXT_PUBLIC_HOST}/frames/frame-image?state=${state}&imageIndex=${imageIndex}`;

  let totalUserProjects = 0;

  let buttons;
  switch (state) {
    case 'home':
      buttons = [
        <Button
          action="post"
          target={{ pathname: '/portfolio/pentacle', query: { projectIndex: '0' } }}
          key="portfolio"
        >
          Folio
        </Button>,
        <Button key="team" action="post" target={{ query: { state: 'team' } }}>
          Team
        </Button>,
        <Button key="website" action="link" target={`https://${websiteUrl}`}>
          View site
        </Button>,
      ];
      break;
    // case 'portfolio': {
    //   const projectIndex = parseInt(ctx.searchParams.projectIndex || '0', 10);
    //
    //   const portfolioOwnerInfo = await fetchFarcasterUserInfoByFid(userFid);
    //   const user = await serverClient.getUserByFarcasterHandle(portfolioOwnerInfo.username);
    //   if (!user) {
    //     return error('No user found');
    //   }
    //   totalUserProjects = (await serverClient.getTotalUserProjects(user.userId))[0].count;
    //   const buttons = [
    //     <Button key="home" action="post" target={{ query: { state: 'home' } }}>
    //       🏠
    //     </Button>,
    //     <Button key="image1" action="post" target={{ query: { state: 'images', imageIndex: '0' } }}>
    //       {imageLabels[0]}
    //     </Button>,
    //     <Button key="image2" action="post" target={{ query: { state: 'images', imageIndex: '1' } }}>
    //       {imageLabels[1]}
    //     </Button>,
    //     <Button key="image3" action="post" target={{ query: { state: 'images', imageIndex: '2' } }}>
    //       {imageLabels[2]}
    //     </Button>,
    //   ];
    //
    //   if (totalUserProjects > projectIndex + 1) {
    //     buttons.push(
    //       <Button
    //         key="next"
    //         action="post"
    //         target={{ query: { state: 'portfolio', projectIndex: projectIndex + 1 } }}
    //       >
    //         ➡️
    //       </Button>,
    //     );
    //   }
    //   break;
    // }

    case 'team':
      buttons = [
        <Button key="home" action="post" target={{ query: { state: 'home' } }}>
          🏠
        </Button>,
        <Button key="warpcast" action="link" target={`https://warpcast.com/${warpcastHandle}`}>
          {warpcastHandle}
        </Button>,
      ];
      break;
    default:
      buttons = [
        <Button key="home" action="post" target={{ query: { state: 'home' } }}>
          🏠
        </Button>,
      ];
  }

  return {
    image: imageUrl,
    buttons: buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
