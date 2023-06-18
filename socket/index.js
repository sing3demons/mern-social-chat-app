const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

const users = []
const addUser = (userId, socketId) => {
  console.log('users', users)
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId })
  }
  console.log('+users', users)
}

const removeUser = (socketId) => {
  users.filter((user) => user.socketId !== socketId)
  console.log('-users', users)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

io.on('connection', (socket) => {
  // when connect
  console.info('a user connected')
  // take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    io.emit('getUsers', users)
  })

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId)
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text,
    })
  })

  socket.on('online', () => {
    io.emit('getUsers', users)
  })

  // when disconnect
  socket.on('disconnect', () => {
    removeUser(socket.id)
    console.info('user disconnected')
  })
})

server.listen(8900, () => console.log('Backend server is running!'))
