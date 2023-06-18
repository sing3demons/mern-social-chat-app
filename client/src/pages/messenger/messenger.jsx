import { useContext, useEffect, useRef, useState } from 'react'
import TopBar from '../../components/topbar/Topbar.jsx'
import './messenger.css'
import Conversation from '../../components/conversations/Conversation.jsx'
import Message from '../../components/message/Message.jsx'
import ChatOnline from '../../components/chatOline/ChatOnline.jsx'
import { AuthContext } from '../../context/AuthContext.js'
import axios from 'axios'
import { io } from 'socket.io-client'

export default function Messenger() {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessages, setNewMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef()

  const { user } = useContext(AuthContext)
  const scrollRef = useRef()

  useEffect(() => {
    socket.current = io('ws://localhost:8900')
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    })
  }, [])

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit('addUser', user._id)
    socket.current.on('getUsers', (users) => {
      console.log('following', user.followings)
      setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)))
      console.log('users', users)
    })
  }, [user])

  console.log('onlineUsers', onlineUsers)

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get('/conversations/' + user._id)
        // console.log(res)
        setConversations(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getConversations()
  }, [user._id])

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get('/messages/' + currentChat?._id)
          setMessages(res.data)

          //   console.log(res.data)
        }
        // console.log('currentChat', currentChat)
      } catch (err) {
        console.log(err)
      }
    }
    getMessages()
  }, [currentChat])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
      sender: user._id,
      text: newMessages,
      conversationId: currentChat._id,
    }

    const receiverId = currentChat.members.find((member) => member !== user._id)

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessages,
    })

    try {
      const { data } = await axios.post('/messages', message)
      if (data) {
        setMessages([...messages, data])
        setNewMessages('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      <TopBar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <input type='text' placeholder='Search for friends' className='chatMenuInput' />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} id={user._id} />
                    </div>
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    placeholder='write something...'
                    className='chatMessageInput'
                    onChange={(e) => setNewMessages(e.target.value)}
                    value={newMessages}
                  ></textarea>
                  <button className='chatSubmitButton' onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className='noConversationText'>Open a conversation to start a chat.</span>
            )}
          </div>
        </div>
        <div className='chatOnline'>
          <div className='chatOnlineWrapper'>
            <h4
              style={{
                padding: '10px',
                color: 'rgb(0, 0, 0, 0.1)',
              }}
            >
              online
            </h4>
            <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  )
}
