import React, {useState} from 'react'
import socket from "./socket";
import classNames from "classnames";

function App() {


  const [userName, setUserName] = useState('')
  const [isLogin, setLogin] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [user, setUser] = useState([])
  const [exit, setExit] = useState(false)


  const [state, setState] = useState({
    users: [],
    messages: []
  })

  window.socket = socket;


  React.useEffect(() => {
    console.log('weweweewewwefdsvsdv')
    socket.on('NEWUSER',(resp) => {
      console.log(resp)
      // setState((prev) => {users: [...prev.users, resp]})
      setState((prev) => ({...prev, users: [...new Set([...prev.users, resp])]}))
    })
    socket.on('NEWMESSAGE',(resp) => {
      console.log(resp)
      setState((prev) =>  ({...prev, messages: [...prev.messages, resp]}))
    })
    socket.on('TEST', (resp) => console.log('WORRJRJRJ'))
    socket.on('LOGINUSER', loginUser)
    authorization()
  },[])

  const loginUser = (resp) => {
    socket.emit('connection')
    setState(resp)
  }
  const authorization = () => {
    if (localStorage.getItem('user')) {
      console.log('ewew')
      socket.emit('LOGINUSER', localStorage.getItem('user'))
      setLogin(true)
      setUserName(localStorage.getItem('user'))
    }
  }

  const Login = () => {
    if (!userName) {
      setError(true)
      return
    }
    console.log('dobro')
    console.log(userName)
    setError(false)
    socket.open();
    socket.emit('LOGINUSER',userName)
    localStorage.setItem('user', userName)
    setLogin(true)
  }


  function sendMessage() {
    socket.emit('NEWMESSAGE', {userName, message})
    setMessage('')
  }

  const exitHandler = () => {
    socket.disconnect()
    localStorage.clear()
    setExit(true)
    setLogin(false)

  }

  return (
    <div className='wrapper'>
      {isLogin ? <div className="room">
          <div className='list_user'>
            {state.users.map((item) =>
              (<div className="user">{item}</div>)
            )}
            <div className='exit' onClick={exitHandler}>
              <img src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-vitaly-gorbachev/60/000000/external-exit-emergency-vitaliy-gorbachev-lineal-vitaly-gorbachev.png"/>
            </div>
          </div>
          <div className='chat'>
            <h1>Комната для общения</h1>
            <div className="messages">
              {state.messages.map((message) => (
                <div className='message-wrapper'>
                  <div className={classNames('message', {'my-message':message.userName === userName})}>
                    <div className="message-text">{message.message}</div>
                    <div className="message-user">{message.userName}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className='create-message'>
              <input value={message} onChange={(event => setMessage(event.target.value))} className='chat-input' type="text"/>
              <button className='message-send' onClick={() => sendMessage()}><img src="https://img.icons8.com/material-sharp/34/000000/filled-sent.png"/></button>
            </div>
          </div>
        </div>

        :
        <div className='login'>
          <h1>Введите ник</h1>
          <input value={userName} onChange={(event) => setUserName(event.target.value)} className={classNames('login-input', {'error': error} )} type="text"/>
          <button className='login-button' onClick={() => Login()}>Ввойти</button>
        </div>
      }
    </div>
  );
}

export default App;
