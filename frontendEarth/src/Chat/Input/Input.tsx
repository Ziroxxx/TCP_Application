import React, {useState} from "react";
import {useUser} from "../../hooks/useUser";
import {Message} from "../../consts";
import {Button, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import "./Input.css"

type InputProps = {
  ws: any,
  MessageArray: any,
  setMessageArray: any
}

export const Input: React.FC<InputProps> = ({ws, setMessageArray, MessageArray}) => {
  const {login} = useUser();
  const [message, setMessage] = useState<Message>({data: ''});

  const handleChangeMessage = (event: any) => {
    const newMsg: Message = {
      id: Date.now(),
      data: event.target.value,
      username: login,
      send_time: String(new Date()),
    };
    setMessage(newMsg);
  };

  const handleClickSendMessBtn = () => {
    if (login && ws && message.data !== '') {
      // const wrappedMessage = {
      //   type: 'message',         
      //   payload: message
      // };
      const msgJSON = JSON.stringify(message);
      ws.send(msgJSON);

      setMessage({data: ''})
      setMessageArray((currentMsgArray: any) => [...currentMsgArray, message]);
    }
  };
  return (
    <>
        <div className="chat-input">
            <div className="inverse--column--input">
              <TextField
                label="Введите сообщение..."
                multiline
                maxRows={4}
                value={message.data}
                variant="standard"
                onChange={handleChangeMessage}
                sx={{width: "100%",
                    '& .MuiInput-underline:hover:before': {
                      borderBottomColor: '#8951FF',
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: '#8951FF',
                    },
                    '& .MuiInputLabel-root.Mui-focused':{
                      color: "black"
                    },
                  }}
              />
            </div>
            <Button variant="outlined"
                    endIcon={<SendIcon/>}
                    style={{
                    margin: '0 2em',
                    padding: '0 2em',
                    }}
                    sx={{
                      backgroundColor: 'white',
                      color: "#8951FF", 
                      borderColor: "#8951FF",
                      '&:hover': {
                          backgroundColor: "#8951FF",
                          color: 'white'
                      },
                      '&:active': {
                          backgroundColor: '#9C3E1D',
                      },
                    }}
                    onClick={handleClickSendMessBtn}
            >
            Отправить
            </Button>
        </div>
    </>
  );
}