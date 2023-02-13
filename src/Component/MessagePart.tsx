/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import date from '../../resources/helper/Date';
import getData from '../../resources/helper/GetData';
import getImage from '../../resources/helper/ImageChoice';
import emailOpen from '../../resources/image/icon-mail-open.svg';
import phone from '../../resources/image/icon-phone.svg';

function MessagePart(props: any) {
  const [message, setMessage] = useState<any>([]);
  const messageId = props.idMessage;
  const realtor = props.idRealtor;

  async function closeMessage() {
    set;
    window.location.reload();
  }

  useEffect(() => {
    const controller = new AbortController();
    getData(
      `http://localhost:8080/realtors/${realtor}/messages/${messageId}`,
      setMessage,
    );
    return () => controller?.abort();
  }, [messageId]);

  return (
    <div className="App-mail">
      {message.length === 0 ? null : (
        <div className="App-info">
          <button type={'button'} onClick={closeMessage} className="closeMessage">
            close
          </button>
          <div className="TopInfo">
            <div className="imageMailOpen">
              {getImage(message.type, message.read) === 'phone' && (
                <img src={phone} className="filterColor" alt="téléphone" />
              )}
              {getImage(message.type, message.read) === 'emailOpen' && (
                <img src={emailOpen} className="emailOpenSvg" alt="courrier ouvert" />
              )}
            </div>
            <div className="senderInfo">
              <div className="mailInfoName">
                <strong>
                  {message['contact'].firstname} {message['contact'].lastname}
                </strong>
              </div>
              <div className="infoContact">
                <div className="emailInfo">
                  <div className="label">Email</div>
                  <div className="contact">{message['contact'].email}</div>
                </div>
                <div className="phoneInfo">
                  <div className="label">Phone</div>
                  <div className="contact">{message['contact'].phone}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mail">
            <div className="bottomName">
              <strong>
                {message['contact'].firstname} {message['contact'].lastname}
              </strong>
            </div>
            <div className="dateInfo">{date(message.date)}</div>
            <div className="content">
              <p>{message.type === 'email' ? message.body : message.type}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagePart;
