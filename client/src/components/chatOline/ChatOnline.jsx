import React from 'react'
import './chatOnline.css'

export default function ChatOnline() {
  return (
    <div className='chatOnline'>
      <ChatOnlineFriend />
      <ChatOnlineFriend />
      <ChatOnlineFriend />
      <ChatOnlineFriend />
    </div>
  )
}

function ChatOnlineFriend() {
  return (
    <div className='chatOnlineFriend'>
      <div className='chatOnlineImgContainer'>
        <img className='chatOnlineImg' src='https://avatars.githubusercontent.com/u/47815596?v=4' alt='' />
        <div className='chatOnlineBadge'></div>
      </div>
      <div className='chatOnlineName'>John Doe</div>
    </div>
  )
}
