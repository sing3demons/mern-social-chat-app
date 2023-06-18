import React, { useEffect, useState } from 'react'
import './message.css'
import { format } from 'timeago.js'
import axios from 'axios'

export default function Message({ message, own, id }) {
  //   console.log('message', message)
  const [avatar, setAvatar] = useState(null)
  useEffect(() => {
    const getAvatar = async () => {
      try {
        const { data } = await axios.get(`/users/${message.sender}`)
        if (data?.profilePicture) {
          setAvatar(data.profilePicture)
        } else {
          setAvatar('http://localhost:8800/images/person/noAvatar.png')
        }
      } catch (err) {
        console.log(err)
      }
    }
    getAvatar()
  }, [message])
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className='messageTop'>
        <img className='messageImg' src={avatar} alt='' />
        <p className='messageText'>{message?.text}</p>
      </div>
      <div className='messageBottom'>{format(message.createdAt)}</div>
    </div>
  )
}
