import React from "react";
import {useUser} from "../../hooks/useUser";
import {Message} from "../../consts";

type MessageProps = {
  msg: Message;
}

export const MessageCard: React.FC<MessageProps> = ({msg}) => {
  const {login} = useUser();

  // функция для форматирования времени, чтобы оно красиво отображалось
  function formatTime(isoDateTime: string | number | Date) {
    const dateTime = new Date(isoDateTime);
    return dateTime.toLocaleString('en-US', {
      timeZone: 'Europe/Moscow',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
  }

  return (
    <>
      <div className={`${msg.username === login ? "msg--own" : "msg--alien"} msg--container`}>
        <div className={`${msg.username === login ? "msg--own--reverse msg--bg--own" : "msg--alien--reverse msg--bg--alien"} msg`}>
          <div className="msg--service">
            <div>
              {msg.username ?? 'Аноним'}
            </div>
            <div style={{marginLeft: '1em'}}>
              {formatTime(msg.send_time ?? String(new Date()))}
            </div>
          </div>

          {msg.error ?
            <div style={{color: 'gray'}}>Ошибка при отправке: {msg.error}</div>
            :
            <div className={`msg--text`}>{msg.data}</div>
          }
        </div>
      </div>
    </>
  );
}