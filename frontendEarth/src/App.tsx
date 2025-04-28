import React, {useEffect, useState} from 'react';
import './App.css';
import { Login } from './Login/Login';
import "./Login/Login.css"
import "./Chat/Chat.css"
import "./Chat/Input/Input.css"
import "./Chat/MessageCard/MessageCard.css"
import {hostname, port, Message, Receipt} from "./consts";
import {Chat} from "./Chat/Chat";
import {useUser} from "./hooks/useUser";

function App() {
  const {login} = useUser();
  const [ws, setWs] = useState<WebSocket | undefined>();  // весокет
  const [messageArray, setMessageArray] = useState<Message[]>([]);

  useEffect(() => {
    if (login) {
      setWs(
        createWebSocket(
          `ws://${hostname}:${port}/?username=${encodeURIComponent(login)}`,
        ),
      );
    } else {
      setWs(new WebSocket(`ws://${hostname}`));
    }
  }, []);

  // создаем вебсокет
  const createWebSocket = (url: string) => {
    const ws = new WebSocket(url); // создаем новый инстанс

    // обработчик на открытие соединения
    ws.onopen = function () {
      console.log('WebSocket connection opened');
    };

    // обработчик на получение сообщения
    ws.onmessage = function (event) {
      const data = event.data;
      const message = JSON.parse(data); // парсим

      if (message.type === 'message'){
        console.log('MessageCard from server:', message);
        // сеттим сообщение в массив
        setMessageArray((currentMsgArray: Message[]) => [...currentMsgArray, message.payload]);
      }
      else{
        const receipt: Receipt = message.payload;
        console.log('Received receipt:', receipt);
        setMessageArray((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id == receipt.msg_id ? { ...msg, error: receipt.status ? 'sent' : 'not_sent' } : msg
          )
        );
      }
    };
    // обработчик на закрытие
    ws.onclose = function () {
      console.log('WebSocket connection closed');
    };

    // обработчик на ошибку
    ws.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    return ws;
  };


  return (
    <div className="App">
      <div className='App'>
      {login ?
          <Chat ws={ws} setMessageArray={setMessageArray} messageArray={messageArray}/>
          :
          <Login ws={ws} setWs={setWs} createWebSocket={createWebSocket}/>
        }
      </div>
    </div>
  );
}

export default App;