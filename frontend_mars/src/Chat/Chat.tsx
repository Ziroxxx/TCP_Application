import {useUser} from "../hooks/useUser";
import {Message} from "../consts";
import {MessageCard} from "./MessageCard/MessageCard";
import {Button} from "@mui/material";
import React from "react";

type ChatProps = {
  ws: WebSocket | undefined;
  messageArray: Message[];
  setMessageArray: (msg: Message[]) => void;
}

export const Chat: React.FC<ChatProps> = ({ws, messageArray, setMessageArray}) => {
  const {login, resetUser} = useUser();

  // при логауте закрываем соединение
  const handleClickLogoutBtn = () => {
    resetUser();
    if (ws) {
      ws.close(4000, login);
    } else {
      console.log("ws.close(4000, 'User logout'); don't work");
    }
  };

  return (
    <>
      <div className="chat">
        <div className="chat--header">
          <div className="chat--header--topic">Star Message</div>
          <Button className="chat--header--login" variant="text" onClick={handleClickLogoutBtn} sx={{color: "white"}}>{login}</Button>
        </div>
        <div className="chat--header--images">
            <img src="./earth.svg" alt="Earth" />
            <img src="./mars.svg" alt="Mars" />
        </div>

        <div className="chat--body">
          {messageArray.length > 0 ?
              <div className="chat--container">
                {messageArray.map((msg: Message, index: number) => (
                  <div key={index} className="chat--msg">
                    <MessageCard msg={msg}/>
                  </div>
                ))}
              </div>
              :
              <div className="chat--no-msg">
                <div style={{fontSize: '2vw', color: 'gray'}}>Скоро тут будут сообщения с Земли!</div>
              </div>
            }
        </div>
      </div>
    </>
  );
}