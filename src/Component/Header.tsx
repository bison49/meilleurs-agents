/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useEffect, useState } from 'react';

import logo from '../../resources/image/icon-aviv.svg';
import counter from '../../resources/image/icon-counter.svg';

function Header(props: any) {
  const realtor = props.idRealtor;
  const messageId = props.idMessage;
  const [count, setCount] = useState();
  const counterBackground = count === 0 ? '#afafaf' : '#5b22e9';
  const [realtors, setRealtors] = useState<any[]>([]);

  const handleEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.headerToHome(parseInt(e.target.value));
  };

  useEffect(() => {
    const counter = document.getElementById('App-counter');
    if (counter != null) {
      counter.style.background = counterBackground;
    }
  }, [count]);

  useEffect(() => {
    // create a controller
    const controller = new AbortController();
    axios
      .get(`http://localhost:8080/realtors/`)
      .then((res) => res.data)
      .then((data) => {
        setRealtors(data);
      })
      .catch((e) => alert(e.message));
    //aborts the request when the component umounts
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`http://localhost:8080/realtors/${realtor}`)
      .then((res) => res.data)
      .then((data) => {
        setCount(data.unread_messages);
      })
      .catch((e) => alert(e.message));
    return () => controller?.abort();
  }, [realtor, messageId]);

  return (
    <header className="App-header">
      <div className="App-logo">
        <img src={logo} className="logo" alt="logo de l'entreprise aviv" />
      </div>
      <div className="right">
        <div id="App-counter" className="App-counter">
          <img
            src={counter}
            className="counter"
            alt="illustration pour le courrier et nombre de courriers non-lus"
          />
          <p className="count">{count}</p>
        </div>
        <div className="App-realtors">
          <select
            className="realtors"
            name="realtors"
            value={realtor}
            onChange={handleEvent}
          >
            {realtors.map((element, index) => (
              <option key={index} value={element.id}>
                {element.name}
              </option>
            ))}
            ;
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
