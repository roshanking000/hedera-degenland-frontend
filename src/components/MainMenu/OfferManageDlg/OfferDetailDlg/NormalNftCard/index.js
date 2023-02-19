import React from 'react';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DoneIcon from '@mui/icons-material/Done';
import Box from '@mui/material/Box';

function NormalNftCard({
  singleNftInfo,
  showDoneIcon,
  onClickNormalNftCard
}) {
  return (
    <Box sx={{
      position: 'relative',
      border: '3px solid',
      borderColor: 'white',
      width: '160px',
      height: '160px',
    }} onClick={onClickNormalNftCard}>
      <img alt='' src={singleNftInfo.imgUrl} style={{
        position: 'absolute',
        top: 0,
        left: 0
      }} />
      <video style={{
        width: '154px',
        height: '154px'
      }} autoPlay loop>
        <source src={singleNftInfo.imgUrl} />
      </video>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#ffffff80'
      }}>
        <p style={{
          margin: 0,
          color: '#873135',
          fontWeight: '700',
          width: '100%',
          padding: '0 5px',
          fontSize: '14px'
        }}>{singleNftInfo.name}</p>
      </div>
      {
        showDoneIcon == true && 
        <DoneIcon sx={{
          width: '28px',
          height: '28px',
          borderRadius: '14px',
          border: '3px solid #873135',
          color: `${singleNftInfo.ticked ? '#873135' : 'transparent'}`,
          position: 'absolute',
          top: '5px',
          left: '5px'
        }} />
      }
    </Box >
  );

}

export default NormalNftCard;