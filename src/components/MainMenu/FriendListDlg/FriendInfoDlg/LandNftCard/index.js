import React from 'react';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DoneIcon from '@mui/icons-material/Done';
import Box from '@mui/material/Box';

function LandNftCard({
    singleNftInfo,
    showDoneIcon,
    onClickLandNftCard
}) {
    return (
        <Box sx={{
            position: 'relative',
            border: '3px solid',
            borderColor: 'white',
            minWidth: '160px',
            maxWidth: '160px',
            height: '160px',
            cursor: 'pointer',
            '&:hover': {
                borderColor: '#873135'
            }
        }} onClick={onClickLandNftCard}>
            <img alt='' src={singleNftInfo.imgUrl} style={{
            position: 'absolute',
            width: '154px',
            height: '154px',
            top: 0,
            left: 0,
          }}/>
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#873135',
                    fontSize: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <ApartmentIcon />
                        <p style={{
                            margin: 0,
                            fontWeight: '500'
                        }}>{singleNftInfo.buildingCount}</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <PeopleIcon />
                        <p style={{
                            margin: 0,
                            fontWeight: '500'
                        }}>{singleNftInfo.totalVisitor}</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <TrendingUpIcon />
                        <p style={{
                            margin: 0,
                            fontWeight: '500'
                        }}>{singleNftInfo.score}</p>
                    </div>
                </div>
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

export default LandNftCard;