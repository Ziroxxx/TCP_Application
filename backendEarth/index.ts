import express from 'express'
import axios from 'axios'
import http from 'http'
import ws, {type WebSocket} from 'ws'

const port: number = 8010; // порт на котором будет развернут этот (вебсокет) сервер
const hostname = '0.0.0.0'; // адрес вебсокет сервера
const transportLevelPort = 8080; // порт сервера транспортного уровня
const transportLevelHostname = '10.147.18.59'; // адрес сервера транспортного уровня

interface Message {
    id?: number
    username: string
    data?: string
    send_time?: string
    error?: string
  }

interface MessageForTransport {
  id?: number
  username?: string
  payload?: string
  timestamp?: string
}

interface Receipt{
  msg_id: number
  status: boolean
}

interface WSMessage<T = any> {
  type: 'message' | 'receipt'; // тип события
  payload: T;                  // сами данные
}

type Users = Record<string, Array<{
    id: number
    ws: WebSocket
}>>

const app = express(); // создание экземпляра приложения express
const server = http.createServer(app); // создание HTTP-сервера

// Используйте express.json() для парсинга JSON тела запроса
app.use(express.json());

// запуск сервера приложения
server.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`)
})

const wss = new ws.WebSocketServer({server})
const users: Users = {}

// app.post('/receive', (req: { body: Message }, res: { sendStatus: (arg0: number) => void }) => {
//   const message: Message = req.body
//   sendMessageToOtherUsers(message.username, message)
//   res.sendStatus(200)
// })

app.post('/receiveReceipt', (req: { body: WSMessage<Receipt> }, res: { sendStatus: (arg0: number) => void }) => {
  const receipt: Receipt = req.body.payload
  console.log(`Received receipt for message ${receipt.msg_id} with status: ${receipt.status}`)
  handleReceipt(receipt)
  res.sendStatus(200)
})

function handleReceipt(receipt: Receipt): void {
  const msgString = JSON.stringify({
    type: 'receipt',
    payload: receipt
  })

  for (const key in users) {
    users[key].forEach(element => {
      element.ws.send(msgString)
    })
  }
}

function sendMessageToOtherUsers(username: string, message: Message): void {
  const wsMessage: WSMessage<Message> = {
    type: 'message',
    payload: message
  }

  const msgString = JSON.stringify(wsMessage) // сериализуем сообщение
  for (const key in users) {  // рассылаем всем юзерам
    if (key !== username) {   // кроме нашего юзера
      users[key].forEach(element => {
        element.ws.send(msgString)
      })
    }
  }
}

const sendMsgToTransportLevel = async (message: Message): Promise<void> => {
  let messageForTransport: MessageForTransport = {
    id: message.id,
    username: message.username,
    payload: message.data,
    timestamp: message.send_time
  }
  try{
    const response = await axios.post(`http://${transportLevelHostname}:${transportLevelPort}/Send`, messageForTransport)
    if (response.status !== 200) {
      message.error = 'Error from transport level by sending message'
      users[message.username].forEach(element => {
        if (message.id === element.id) {
          element.ws.send(JSON.stringify(message))
        }
      })
    }
    console.log('Response from transport level: ', response)}
  catch { 
    console.log("transport not available")
    sendMessageToOtherUsers(message.username ?? 'Anonymus', message)
  }
}

// обрабочик на коннект для вебсокета
wss.on('connection', (websocketConnection: WebSocket, req: Request) => {
    if (req.url.length === 0) {
      console.log(`Error: req.url = ${req.url}`)
      return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const url = new URL(req?.url, `http://${req.headers.host}`)
    const username = url.searchParams.get('username') // берем имя юзера из параметра
  
    if (username !== null) {
      console.log(`[open] Connected, username: ${username}`)
  
      if (username in users) {
        users[username] = [...users[username], {id: users[username].length, ws: websocketConnection}]
      } else {
        users[username] = [{id: 1, ws: websocketConnection}]
      }
    } else {
      console.log('[open] Connected')
    }
  
    console.log('users collection', users)
    
    websocketConnection.on('message', (messageString: string) => {
      console.log('[message] recived from ' + username + ': ' + messageString)
      const message: Message = JSON.parse(messageString)
      message.username = message.username ?? username
      void sendMessageToOtherUsers(message.username, message)
      void sendMsgToTransportLevel(message)
    })

    // обработчик на закрытие
    websocketConnection.on('close', (event: any) => {
      console.log(username, '[close] Соединение прервано', event)
      if (username !== null) {
        delete users[username];
      }
      console.log('users collection', users)
    })
  })

