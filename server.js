const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());


const state = {
  users: [],
  messages: []
}
const userId = []


io.on('connection', (socket) => {
  console.log('eee')
  socket.on('LOGINUSER', (resp) => {
    // socket.join(222)
    state.users.push(resp)
    console.log('Login')
    console.log(resp)
    userId.push({id:socket.id, user: resp})
    // socket.broadcast.emit('NEWUSER', state.user)
    // socket.to(222).emit('NEWUSER', state.user)
    // socket.to(222).broadcast.emit('NEWUSER', state.user)
    io.emit('LOGINUSER', state)
    // socket.broadcast.emit('NEWUSER', resp)
  })
  socket.on('NEWUSER', (resp) => {
    console.log(resp)
    state.users.push(resp)
    // socket.broadcast.emit('NEWUSER', state.user)
    io.emit('NEWUSER', resp)
  })
  socket.on('TEST', () => {
    console.log('rerer')
    socket.emit('TEST', {})
  })
  socket.on('NEWMESSAGE', (resp) => {
    console.log(resp)
    state.messages.push(resp)
    io.emit('NEWMESSAGE', resp)
    // socket.broadcast.emit('NEWMESSAGE', state.message)
  })
  socket.on('disconnect', () => {
    console.log(userId)
    console.log(userId.find(obj => obj.id === socket.id)?.user);
    state.users = state.users.filter(user => user !== userId.find(obj => obj.id === socket.id)?.user)
    console.log(state)
    console.log('disconect')
    io.emit('LOGINUSER', state)
  })
  console.log('user connected', socket.id);
})

server.listen(2000, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});