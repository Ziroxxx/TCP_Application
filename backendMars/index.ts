import express from 'express'
import axios from 'axios'
import http from 'http'
import ws, {type WebSocket} from 'ws'

const port: number = 8020; // порт на котором будет развернут этот (вебсокет) сервер
const hostname = '192.168.56.1'; // адрес вебсокет сервера

interface Message {
    id?: number
    username: string
    data?: string
    send_time?: string
    error?: string
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

app.post('/receive', (req: { body: Message }, res: { sendStatus: (arg0: number) => void }) => {
  const message: Message = req.body
  sendMessageToOtherUsers(message.username, message)
  res.sendStatus(200)
})

function sendMessageToOtherUsers(username: string, message: Message): void {
  const msgString = JSON.stringify(message) // сериализуем сообщение
  for (const key in users) {  // рассылаем всем юзерам
    //console.log(`[array] key: ${key}, users[keys]: ${JSON.stringify(users[key])} username: ${username}`)
    if (key !== username) {   // кроме нашего юзера
      users[key].forEach(element => {
        element.ws.send(msgString)
      })
    }
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
      sendMessageToOtherUsers(message.username, message)
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

