import React, { Component } from 'react';

import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import EmojiPicker from './../emoji-picker/EmojiPicker';

class EmojiIcon extends Component {

  constructor() {
    super();
    this.state = {
      isActive: false
    };
  }

  _openPicker(e) {
    e.preventDefault();
    this.setState({
      isActive: !this.state.isActive
    });
  }

  render() {
    return (
      <div className="sc-user-input--emoji-icon-wrapper">
        {this.state.isActive &&
          <EmojiPicker
            onEmojiPicked={this.props.onEmojiPicked}
          />
        }
        <IconButton sx={EMOJI_BTN_STYLE}
          onClick={this._openPicker.bind(this)}
        >
          <EmojiEmotionsIcon fontSize="medium" />
        </IconButton>
      </div>
    )
  }
};

export default EmojiIcon;

const BUTTON_COLOR = '#1976d2';
const EMOJI_BTN_STYLE = {
    width: '42px',
    height: '42px',
    border: '3px solid',
    borderColor: `${BUTTON_COLOR}`,
    color: `${BUTTON_COLOR}`,
    padding: '0',
    '&:focus': {
        outline: 'none'
    }
};