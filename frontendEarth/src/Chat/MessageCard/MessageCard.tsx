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
        <div className="msg">
          <div className={msg.username === login ? "msg--own--reverse msg--bg--own" : "msg--alien--reverse msg--bg--alien"}>
            <div className="msg--service">
              <div>
                {msg.username ?? 'Аноним'}
              </div>
              <div style={{marginLeft: '1em'}}>
                {formatTime(msg.send_time ?? String(new Date()))}
              </div>
            </div>
            <div className={`msg--text`}>{msg.data}</div>
          </div>
          {msg.error === 'not_sent' ? (
              <div className="msg--status msg--status--bad">
                Не доставлено
                <img className="msg--status--image" src="./warning.png" alt="w" />
              </div>
            ) : msg.error === 'sent' ? (
              <div className="msg--status msg--status--good">
                Доставлено
                <img className="msg--status--image" src="./correct.png" alt="check" />
              </div>
            ) : (
              <div></div>
            )}
        </div>
      </div>
    </>
  );
}