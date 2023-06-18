import React from 'react'
import './message.css'
import { format } from 'timeago.js'

export default function Message({ message, own }) {
  console.log('message', message)
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className='messageTop'>
        <img className='messageImg' src='https://avatars.githubusercontent.com/u/47815596?v=4' alt='' />
        <p className='messageText'>{message?.text}</p>
      </div>
      <div className='messageBottom'>{format(message.createdAt)}</div>
    </div>
  )
}
