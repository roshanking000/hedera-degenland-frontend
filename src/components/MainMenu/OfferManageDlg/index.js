import React, { useState } from 'react';

import {
  Box,
  Grid,
  Button,
  Divider,
  Chip,
} from '@mui/material';

import ListedCollectionCard from '../ListedCollectionCard';
import { SwapHorizontalCircle } from '@mui/icons-material';

const BACKGROUND_COLOR = '#ffc0ff';

function OfferManageDlg({
  offerList,
  claimableOfferList,
  onClickAcceptedOfferDetail,
  onClickMyOfferDetail,
  onClickReceivedOfferDetail,
  onClickCreateOfferBtn,
  onClickViewMyNFTBtn,
  onClickCancelBtn
}) {
  const [offers, setOffers] = useState(offerList);
  const [claimableOffers, setClaimableOffers] = useState(claimableOfferList);

  return (
    <Box sx={{
      backgroundColor: `${BACKGROUND_COLOR}`,
      minWidth: '400px',
      padding: '15px',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Divider textAlign="center" sx={{
          paddingTop: '10px',
          paddingBottom: '30px',
        }}>
          <Chip variant="outlined" label="Claimable Offers" sx={{
            fontWeight: 700,
          }} />
        </Divider>
        <Box>
          {
            claimableOffers?.length == 0 &&
            <p style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#8b1832',
              margin: '0 0 0 5px',
              textTransform: 'none'
            }}>
              No offers
            </p>
          }
          {
            claimableOffers?.length > 0 &&
            claimableOffers.map((item, index) => {
              return <Box key={index}
                sx={{
                  float: 'left',
                  width: '462px',
                  padding: '5px',
                  margin: '5px'
                }}>
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: '#873135',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                  onClick={() => {
                    onClickAcceptedOfferDetail(item);
                  }} >
                  <ListedCollectionCard
                    userInfo={item.receiverInfo}
                    nftList={item.receiverNfts}
                    tokenInfo={item.receiverToken}
                  />
                  <Box sx={{
                    width: 50,
                    height: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{
                      width: '2px',
                      height: '45%',
                      backgroundColor: '#873135',
                    }} />
                    <SwapHorizontalCircle sx={{
                      fontSize: '42px',
                      color: '#873135'
                    }} />
                    <Box sx={{
                      width: '2px',
                      height: '45%',
                      backgroundColor: '#873135',
                    }} />
                  </Box>
                  <ListedCollectionCard
                    userInfo={item.providerInfo}
                    nftList={item.providerNfts}
                    tokenInfo={item.providerToken}
                  />
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    zIndex: '1',
                    '&:hover': {
                      backgroundColor: '#ffffff20',
                      backdropFilter: 'blur(5px)',
                    },
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: 'auto',
                    right: '0',
                    backgroundColor: '#f75cae',
                    color: 'white',
                    padding: '5px 5px 5px 10px',
                    borderBottomLeftRadius: '18px',
                    boxShadow: '0px 0px 20px 0px rgb(0 0 0 / 50%)',
                  }}>
                    {item.state}
                  </div>
                </Box>
              </Box>
            })
          }
        </Box>
        <Divider textAlign="center" sx={{
          paddingTop: '10px',
          paddingBottom: '30px',
        }}>
          <Chip variant="outlined" label="My Offers" sx={{
            fontWeight: 700,
          }} />
        </Divider>
        <Box>
          {
            offers.myOffer?.length == 0 &&
            <p style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#8b1832',
              margin: '0 0 0 5px',
              textTransform: 'none'
            }}>
              No offers
            </p>
          }
          {
            offers.myOffer?.length > 0 &&
            offers.myOffer.map((item, index) => {
              return <Box key={index}
                sx={{
                  float: 'left',
                  width: '462px',
                  padding: '5px',
                  margin: '5px'
                }}>
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: '#873135',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                  onClick={() => {
                    onClickMyOfferDetail(item);
                  }} >
                  <ListedCollectionCard
                    userInfo={item.receiverInfo}
                    nftList={item.receiverNfts}
                    tokenInfo={item.receiverToken}
                  />
                  <Box sx={{
                    width: 50,
                    height: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{
                      width: '2px',
                      height: '45%',
                      backgroundColor: '#873135',
                    }} />
                    <SwapHorizontalCircle sx={{
                      fontSize: '42px',
                      color: '#873135'
                    }} />
                    <Box sx={{
                      width: '2px',
                      height: '45%',
                      backgroundColor: '#873135',
                    }} />
                  </Box>
                  <ListedCollectionCard
                    userInfo={item.providerInfo}
                    nftList={item.providerNfts}
                    tokenInfo={item.providerToken}
                  />
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    zIndex: '1',
                    '&:hover': {
                      backgroundColor: '#ffffff20',
                      backdropFilter: 'blur(5px)',
                    },
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: 'auto',
                    right: '0',
                    backgroundColor: '#f75cae',
                    color: 'white',
                    padding: '5px 5px 5px 10px',
                    borderBottomLeftRadius: '18px',
                    boxShadow: '0px 0px 20px 0px rgb(0 0 0 / 50%)',
                  }}>
                    {item.state}
                  </div>
                </Box>
              </Box>
            })
          }
        </Box>
        <Divider textAlign="center" sx={{
          paddingTop: '10px',
          paddingBottom: '30px',
        }}>
          <Chip variant="outlined" label="Received Offers" sx={{
            fontWeight: 700,
          }} />
        </Divider>
        <Box>
          {
            offers.receivedOffer?.length == 0 &&
            <p style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#8b1832',
              margin: '0 0 0 5px',
              textTransform: 'none'
            }}>
              No offers
            </p>
          }
          {
            offers.receivedOffer?.length > 0 &&
            offers.receivedOffer.map((item, index) => {
              return <Box key={index}
                sx={{
                  float: 'left',
                  width: '462px',
                  padding: '5px',
                  margin: '5px'
                }}>
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: '#873135',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                  onClick={() => {
                    onClickReceivedOfferDetail(item);
                  }} >
                  <ListedCollectionCard
                    userInfo={item.receiverInfo}
                    nftList={item.receiverNfts}
                    tokenInfo={item.receiverToken}
                  />
                  <Box sx={{
                    width: 50,
                    height: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{
                      width: '2px',
                      height: '45%',
                      backgroundColor: '#873135',
                    }} />
                    <SwapHorizontalCircle sx={{
                      fontSize: '42px',
                      color: '#873135'
                    }} />
                    <Box sx={{
                      width: '2px',
                      height: '45%',
                      backgroundColor: '#873135',
                    }} />
                  </Box>
                  <ListedCollectionCard
                    userInfo={item.providerInfo}
                    nftList={item.providerNfts}
                    tokenInfo={item.providerToken}
                  />
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    zIndex: '1',
                    '&:hover': {
                      backgroundColor: '#ffffff20',
                      backdropFilter: 'blur(5px)',
                    },
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: 'auto',
                    right: '0',
                    backgroundColor: '#f75cae',
                    color: 'white',
                    padding: '5px 5px 5px 10px',
                    borderBottomLeftRadius: '18px',
                    boxShadow: '0px 0px 20px 0px rgb(0 0 0 / 50%)',
                  }}>
                    {item.state}
                  </div>
                </Box>
              </Box>
            })
          }
        </Box>
      </Box>
      {/* buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0',
        width: '100%',
        padding: '0 20px'
      }}>
        <Button onClick={onClickCreateOfferBtn}
          sx={{
            height: '42px',
            borderRadius: '21px',
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 700,
            color: 'white',
            padding: '0 25px',
            backgroundColor: '#e74895',
            marginRight: '20px',
            '&:hover': {
              backgroundColor: 'grey',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            }
          }}>
          Create Offer
        </Button>
        <Button onClick={onClickViewMyNFTBtn}
          sx={{
            height: '42px',
            borderRadius: '21px',
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 700,
            color: 'white',
            padding: '0 25px',
            backgroundColor: '#e74895',
            marginRight: '20px',
            '&:hover': {
              backgroundColor: 'grey',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            }
          }}>
          View My NFT
        </Button>
        <Button onClick={onClickCancelBtn}
          variant='outlined'
          sx={{
            height: '42px',
            borderRadius: '21px',
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 700,
            color: '#e74895',
            padding: '0 25px',
            border: '3px solid #e74895',
            '&:hover': {
              backgroundColor: 'grey',
              border: '3px solid grey',
              color: 'white',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            }
          }}>
          Cancel
        </Button>
      </div>
    </Box>
  );
}

export default OfferManageDlg;
