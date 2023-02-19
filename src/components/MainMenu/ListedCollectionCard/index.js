import React, { useState, useEffect } from "react";
import { Button, Box } from '@mui/material';
import { Carousel } from "react-responsive-carousel";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./style.scss";

import * as env from "../../../env";

const BACKGROUND_COLOR = '#ffc0ff';
const ACTIVE_BADGE_COLOR = '#44b700';
const TEXT_COLOR_1 = '#873135';
const TEXT_COLOR_2 = '#3c617e';
const TEXT_COLOR_3 = '#3c617e';

function ListedCollectionCard({
  userInfo,
  nftList,
  tokenInfo
}) {
  const [userData, setUserData] = useState({});
  const [nftData, setNftData] = useState({});
  const [tokenValue, setTokenValue] = useState({});

  useEffect(() => {
    setUserData(userInfo);
    setNftData(nftList);
    setTokenValue(tokenInfo);
  }, [userInfo, nftList, tokenInfo]);

  return (
    <Box className="listed-collection-card-wrapper">
      <Box>
        {
          nftData?.length > 0 &&
          <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
            {
              nftData.map((item_, index_) => {
                return <div key={index_} className="single-nft">
                  <video className="nft-image" alt="..." src={item_.imgUrl} autoPlay loop />
                  <img className="nft-image" alt="..." src={item_.imgUrl} />
                  <div className="nft-name-verify">
                    <p>{`${item_.name}`}</p>
                  </div>
                </div>
              })
            }
          </Carousel>
        }
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
        position: 'relative',
        marginTop: '5px',
      }}>
        <Badge
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant='dot'
          sx={{
            '& .MuiBadge-badge': {
              width: '16px',
              height: '16px',
              borderRadius: '8px',
              backgroundColor: `${userData.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
              color: `${userData.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: `${userData.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
                border: '1px solid currentColor',
                content: '""',
              },
            },
            '@keyframes ripple': {
              '0%': {
                transform: 'scale(.8)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
              },
            },
          }}
        >
          <Avatar alt={userData.playerId} src={env.SERVER_URL + userData.avatarUrl}
            sx={{
              width: 60,
              height: 60,
              fontSize: '32px',
              backgroundColor: '#e0e0e0',
              border: '2px solid white'
            }} />
        </Badge>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '10px'
        }}>
          <p style={{
            margin: '0',
            fontSize: '18px',
            fontWeight: '700',
            color: `${TEXT_COLOR_1}`,
            width: '100px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            {userData.playerId}
          </p>
          <LinearProgress variant='determinate' value={(userData.currentLevelScore / userData.targetLevelScore) * 100} />
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '700',
            color: '#1976d2'
          }}>
            Level : {userData.level}
          </p>
        </div>
      </Box>
      <p style={{
        textAlign: 'right',
        paddingRight: '10px',
        fontSize: '12px',
        color: '#873135',
        margin: 0,
        fontWeight: 700,
      }}>
        {tokenValue.hbar} HBAR + {tokenValue.pal} PAL
      </p>
    </Box>
  );
}

export default ListedCollectionCard;

const collection_test_info = {
  playerId: "Rocket",
  level: 25,
  currentLevelScore: 50,
  targetLevelScore: 150,
  connectState: true,
  hbar: 80000000,
  pal: 800000000,
  avatarUrl: 'https://leonardo.osnova.io/18b0a174-b6da-c9f2-22a9-5a116b178be5/-/scale_crop/108x108/-/format/webp/',
  nfts: [
    {
      name: 'royal',
      creator: 'Tinytiger',
      tokenId: '0.0.1094441',
      imgUrl: 'https://leonardo.osnova.io/18b0a174-b6da-c9f2-22a9-5a116b178be5/-/scale_crop/108x108/-/format/webp/'
    },
    {
      name: 'royal',
      creator: 'Tinytiger',
      tokenId: '0.0.1094441',
      imgUrl: 'https://leonardo.osnova.io/18b0a174-b6da-c9f2-22a9-5a116b178be5/-/scale_crop/108x108/-/format/webp/'
    }
  ]
};