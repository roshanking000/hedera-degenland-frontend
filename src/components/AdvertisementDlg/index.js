import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { VideoUpload } from '../VideoUpload';
import { getRequest, postRequest } from "../../assets/api/apiRequests";

import * as env from "../../env";

const TITLE_COLOR = '#8b1832';

function AdvertisementDlg({
  advertisementId,
  onClickAddBtn,
  onClickCancelBtn
}) {
  const [loadingView, setLoadingView] = useState(false);
  const [uploadFile, setUploadFile] = useState({});
  const [linkUrl, setLinkUrl] = useState('');

  const onClickAdvertisementAdd = async () => {
    setLoadingView(true);
    if (uploadFile?.length === 0) {
      toast.error("Please select video or image");
      setLoadingView(false);
      return;
    }

    const o_formData = new FormData();
    o_formData.append('advertisement', uploadFile[0]);
    o_formData.append('advertisementId', advertisementId);
    o_formData.append('linkUrl', linkUrl);

    const o_uploadResult = await postRequest(env.SERVER_URL + "/api/placement/upload_advertisement", o_formData);
    if (!o_uploadResult) {
      toast.error("Something wrong with server!");
      setLoadingView(false);
      return;
    }

    if (!o_uploadResult.result) {
      toast.error("Advertisement upload failed! Please try again.");
      setLoadingView(false);
      return;
    }

    toast.success("Advertisement upload successful.");
    setLoadingView(false);
    onClickAddBtn(advertisementId, o_uploadResult.data.name, o_uploadResult.data.billboardInfo, o_uploadResult.data.mimetype);
  }

  return (
    <div
      style={{
        backgroundColor: '#ffc0ff',
        width: '480px',
        padding: '15px',
        overflow: 'hidden'
      }}>
      {/* Place info */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '20px 0 20px 20px',
        position: 'relative',
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <DialogContentText sx={{
            paddingBottom: '10px',
          }}>
            To add advertisement, please upload video or image and enter the site url.
          </DialogContentText>
          <VideoUpload onDrop={files => { setUploadFile(files) }} />
          <TextField sx={{
            paddingTop: '10px',
          }}
            autoFocus
            margin="dense"
            id="name"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
            value={linkUrl}
            onChange={(e) => {
              setLinkUrl(e.target.value);
            }}
          />
        </div>
      </div>
      {/* buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'right',
        margin: '20px 0',
        width: '100%',
        padding: '0 20px'
      }}>
        <Button onClick={() => {
          onClickAdvertisementAdd();
        }}
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
          Add
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingView}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer autoClose={5000} draggableDirection="x" />
    </div>
  );
}

export default AdvertisementDlg;