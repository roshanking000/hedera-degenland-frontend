import React from 'react';
import Box from '@mui/material/Box';

import {
    FavoriteBorderOutlined,
    RemoveRedEyeOutlined
} from '@mui/icons-material';

function NFTCard({
    nftInfo,
    onClickNFTCard
}) {
    return (
        <>
            <Box sx={{
                position: 'relative',
                border: '2px solid',
                borderColor: 'blueviolet',
                borderRadius: '0.375rem',
                width: '250px',
                cursor: 'pointer',
            }} onClick={onClickNFTCard}>
                <Box sx={{
                    borderTopLeftRadius: '0.375rem',
                    borderTopRightRadius: '0.375rem',
                    '&:hover': {
                        opacity: '0.75',
                    }
                }}>
                    <video style={{
                        position: 'absolute',
                        borderRadius: '0.375rem',
                        width: '244px',
                        height: '244px'
                    }} autoPlay loop>
                        <source src={nftInfo.imageUrl} />
                    </video>
                    <img alt='' loading='lazy' src={nftInfo.imageUrl} style={{
                        width: '244px',
                        borderRadius: '0.375rem',
                        height: '244px',
                        top: 0,
                        left: 0,
                    }} />
                </Box>
                <div style={{
                    display: 'flex',
                    marginTop: '1rem',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        width: '100%',
                        paddingLeft: '0.75rem',
                        textAlign: 'left',
                    }}>
                        <p style={{
                            margin: 0,
                            color: '#873135',
                            width: '100%',
                            fontSize: '1.125rem',
                            lineHeight: '1.75rem',
                            fontWeight: '500',
                            width: '230px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}>{nftInfo.name}</p>
                        <p style={{
                            margin: 0,
                            color: 'blue',
                            width: '100%',
                            fontSize: '0.9rem',
                            lineHeight: '1.75rem',
                            fontWeight: '600',
                            width: '230px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}>{nftInfo.creator}</p>
                    </div>
                </div>
                {
                    nftInfo.price &&
                    <div style={{
                        display: 'flex',
                        color: 'rgba(255,255,255,1)',
                        textAlign: 'left',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.25rem'
                    }}>
                        <p style={{
                            color: 'rebeccapurple',
                            fontWeight: '600',
                            fontSize: '.875rem',
                            lineHeight: '1.25rem',
                            paddingLeft: '0.75rem',
                            margin: '0'
                        }}>
                            Price
                        </p>
                        <p style={{
                            paddingRight: '0.75rem',
                            color: 'rebeccapurple',
                            fontWeight: '700',
                            paddingLeft: '0.75rem',
                            margin: '0'
                        }}>
                            {nftInfo.price} ℏ
                        </p>
                    </div>
                }
                {
                    nftInfo.start_auction_price != null && nftInfo.current_auction_price != null &&
                    <div>
                        <div className='text-left sm:flex justify-between items-center mt-1 truncate'>
                            <p className='text-purple-900 text-sm font-medium pl-3 mb-0'>Starting price</p>
                            <p className='text-purple-500 line-through text-md font-bold sm:pr-3 pl-3 mb-0'>{nftInfo.start_auction_price} ℏ</p>
                        </div>
                        <div className='text-left sm:flex justify-between items-center mt-1 truncate'>
                            <p className='text-purple-900 text-sm font-medium pl-3 mb-0'>Current price</p>
                            <p className='text-purple-900 text-md font-bold sm:pr-3 pl-3 mb-0'>{nftInfo.current_auction_price} ℏ</p>
                        </div>
                    </div>
                }
                {
                    nftInfo.favourites != null && nftInfo.watching != null &&
                    <div style={{
                        display: 'flex',
                        marginTop: '0.25rem',
                        color: 'rebeccapurple',
                        paddingTop: '0.25rem',
                        borderColor: 'rgba(31,41,55,1)',
                        borderTop: '1px solid whitesmoke',
                        alignItems: 'center'
                    }}>
                        <FavoriteBorderOutlined fontSize='large' sx={{
                            display: 'block',
                            verticalAlign: 'middle',
                            paddingLeft: '0.75rem',
                            height: '1.25rem',
                            marginRight: '0.25rem'
                        }} />
                        <p style={{
                            margin: '0',
                            marginRight: '0.75rem',
                            fontWeight: '500',
                        }}>
                            {nftInfo.favourites}
                        </p>
                        <RemoveRedEyeOutlined fontSize='large' sx={{
                            display: 'block',
                            verticalAlign: 'middle',
                            height: '1.25rem',
                            marginRight: '0.25rem'
                        }} />
                        <p style={{
                            margin: '0',
                            fontWeight: '500',
                        }}>
                            {nftInfo.watching}
                        </p>
                    </div>
                }
            </Box>
        </>
    );

}

export default NFTCard;