import { useEffect, useState } from 'react'
import './chatOnline.css'
import axios from 'axios'

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get('/users/friends/' + currentId)
        setFriends(res.data)
        console.log('friends', res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getFriends()
  }, [currentId])

  useEffect(() => {
    const of = friends.filter((f) => onlineUsers.includes(f._id))
    setOnlineFriends(of)
  }, [friends, onlineUsers])

  const handleClick = async (user) => {
    try {
      const res = await axios.get(`/conversations/find/${currentId}/${user._id}`)
      setCurrentChat(res.data)
      console.log('--->', res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='chatOnline'>
      {onlineFriends.map((o) => (
        <ChatOnlineFriend online={o} handleClick={handleClick} />
      ))}
    </div>
  )
}

function ChatOnlineFriend({ online, handleClick }) {
  const o = online
  return (
    <div className='chatOnlineFriend' onClick={() => handleClick(o)}>
      <div className='chatOnlineImgContainer'>
        <img
          className='chatOnlineImg'
          src={o?.profilePicture ? o.profilePicture : 'http://localhost:8800/images/person/noAvatar.png'}
          alt=''
        />
        <div className='chatOnlineBadge'></div>
      </div>
      <div className='chatOnlineName'>{o?.username}</div>
    </div>
  )
}
