import React, {useState, useEffect} from "react";
import {useUser} from "../../hooks/useUser";
import {Message} from "../../consts";
import {Button, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import "./Input.css"

const MAX_SIZE = 150;

type InputProps = {
  ws: any,
  MessageArray: any,
  setMessageArray: any
}

export const Input: React.FC<InputProps> = ({ws, setMessageArray, MessageArray}) => {
  const {login} = useUser();
  const [message, setMessage] = useState<Message>({data: ''});
  const [bigMessageArray, setBigMessageArray] = useState<Message[]>([]);

  useEffect(() => {
    console.log("Updated bigMessageArray:", bigMessageArray);
  }, [bigMessageArray]);
  

  const constructMessage = (MessageText: string, partIndex?: number) => {
    return {
      id: partIndex ? Date.now() + partIndex : Date.now(),
      data: MessageText,
      username: login,
      send_time: String(new Date())
    }
  }

  const handleChangeMessage = (event: any) => {
    let msg_text = event.target.value;
    setBigMessageArray([]);
    if(msg_text.length <= MAX_SIZE){
      const newMsg: Message = constructMessage(msg_text);
      setMessage(newMsg);
    }
    else {
      let lenBigMessage = msg_text.length;
      let countOfMessages = Math.ceil(lenBigMessage / MAX_SIZE);
      console.log(countOfMessages);
      let begin = 0;
      let end = MAX_SIZE;
      let tempArray: Message[] = [];
      for (let i = 0; i < countOfMessages; i++) {
        let msgPartText = msg_text.slice(begin, end);
        begin += MAX_SIZE;
        end += MAX_SIZE;
        const msgPartData = constructMessage(msgPartText, i);
        tempArray.push(msgPartData);
      }
      setBigMessageArray(tempArray);
      const displayText = constructMessage(msg_text);
      setMessage(displayText)
    }
  };

  const handleClickSendMessBtn = () => {
    if (message.data && login && ws && message.data !== '' && message.data.length <= MAX_SIZE) {
      const msgJSON = JSON.stringify(message);
      ws.send(msgJSON);
      setMessageArray((currentMsgArray: any) => [...currentMsgArray, message]);
    }
    else if (message.data && login && ws && message.data !== ''){
      for(let i = 0; i < bigMessageArray.length; i++){
        const msgJSON = JSON.stringify(bigMessageArray[i]);
        ws.send(msgJSON);
      }
      setMessageArray((currentMsgArray: any) => [...currentMsgArray, ...bigMessageArray]);
    }
    setMessage({data: ''})
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