/* eslint-disable @typescript-eslint/no-explicit-any */
import './home.css';

import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import logo from '../../resources/image/icon-aviv.svg';
import counter from '../../resources/image/icon-counter.svg';
import email from '../../resources/image/icon-mail.svg';
import emailOpen from '../../resources/image/icon-mail-open.svg';
import phone from '../../resources/image/icon-phone.svg';
import { getByRealtor, getData, getList, getMail } from '../utils/AxiosRequest';
import date from '../utils/helper/Date';
import getImage from '../utils/helper/ImageChoice';
import time from '../utils/helper/Time';

function Home(props: any) {
  //Déclaration des variables
  const isMobile = props.isMobile;
  const { idRealtor, idMessage } = useParams();
  const [oldId, setOldId] = useState('0');
  const navigate = useNavigate();
  const [message, setMessage] = useState<any>([]);
  const [count, setCount] = useState<number>(0);
  const counterBackground = count === 0 ? '#afafaf' : '#5b22e9';
  const [realtors, setRealtors] = useState<any[]>([]);
  const [isMailBoxOpen, setIsMailBoxOpen] = useState(true);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [realtorId, setRealtorId] = useState(
    { idRealtor }.idRealtor !== undefined ? { idRealtor }.idRealtor : 101,
  );
  const [messageId, setMessageId] = useState(
    { idMessage }.idMessage !== undefined ? { idMessage }.idMessage : '0',
  );
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  //Hook permettant de définir le éléments à afficher sur l'éran. Selon la taille de l'écran
  useEffect(() => {
    if (isMobile) {
      setIsMailBoxOpen({ idMessage }.idMessage !== undefined ? false : true);
    } else {
      setIsMailBoxOpen(true);
    }
    setIsMessageOpen({ idMessage }.idMessage !== undefined ? true : false);
  }, [isMobile]);

  //Hook permettent de scroller au top de la liste de message lorsque l'on change d'agence
  //et de réinitialiser la page actuelle à 1.
  useEffect(() => {
    setCurrentPage(1);
    document.getElementById('mailBox')?.scrollTo({ top: 0 });
  }, []);

  //Fonction enlevant le focus sur un élément
  function removeFocus(idMessage: any) {
    if (messageId !== undefined && messageId !== '0') {
      const box = document.getElementById(idMessage);
      box?.classList.remove('focus');
    }
    setMessageId('0');
  }

  //Fonction gérant le changement d'agence dans le select
  const handleRealtor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRealtorId(parseInt(e.target.value));
    setIsMailBoxOpen(true);
    setIsMessageOpen(false);
    removeFocus(messageId);

    navigate(`/realtors/${e.target.value}`);
  };

  //Hook permettant le changer le background du compteur
  useEffect(() => {
    const counter = document.getElementById('App-counter');
    if (counter != null) {
      counter.style.background = counterBackground;
    }
  }, [count]);

  async function fetchData(
    url: string,
    setData: {
      (value: SetStateAction<any[]>): void;
      (value: any): void;
      (arg0: any): void;
    },
  ) {
    await getData(url, setData);
  }

  //Hook permettant d'obtenir les différentes agences
  useEffect(() => {
    // création d'un controlleur
    const controller = new AbortController();
    fetchData(`http://localhost:8080/realtors/`, setRealtors);
    //abandon de la requête quand le composant se démonte
    return () => controller?.abort();
  }, []);

  //fonction permettant la mise à jour du compteur
  async function fetchByRealtor() {
    await getByRealtor(realtorId, setCount);
  }

  //Hook permettant l'appel de la fonction
  useEffect(() => {
    const controller = new AbortController();
    fetchByRealtor();
    return () => controller?.abort();
  }, [realtorId, messageId]);

  //fonction permettant à la div d'être cliquable
  function onKeyPress(realtor: any, id: number, isOpen: boolean) {
    displayMail(realtor, id, isOpen);
  }

  //fonction gérant le clique sur un élément da la liste de message
  async function displayMail(realtor: any, idMessage: any, isOpen: boolean) {
    if (!isOpen) {
      await getMail(realtor, idMessage);
    }
    setMessageId(idMessage);
    if (isMobile) setIsMailBoxOpen(false);
    setIsMessageOpen(true);
    navigate(`/realtors/${realtor}/messages/${idMessage}`);
  }

  //fonction permettant de charger la liste de message selon la page et l'agence
  async function fetchList() {
    await getList(realtorId, currentPage, setMessages, setHasMore, setLoading);
  }

  //Hook chargeant la liste de message selon la page et l'agence
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    fetchList();
    controller?.abort();
  }, [currentPage, realtorId]);

  //Cette variable permet d'observer un changement souhaité dans la liste de message
  const observer = useRef<IntersectionObserver>();
  //Fonction définissant l'observer et permettant de réaliser l'infinity scroll
  const lastMessageRef = useCallback(
    (node) => {
      if (loading) return;
      //Si un observer existe on le déconnecte
      if (observer.current) observer.current.disconnect();
      //L'on défini l'observer comme la dernière entrée de la liste e message
      //Et quand on l'atteint l'on numéro de le page à charger si il reste des données
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((previousPage) => previousPage + 1);
        }
      });
      //L'on ajoute l'élément à observer
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  //Hook permettant de modifier le style d'éléments de la liste de message
  useEffect(() => {
    if (messageId !== undefined && messageId !== '0') {
      const box = document.getElementById(messageId);
      const oldBox = document.getElementById(oldId);
      const svg = document.getElementById('email' + messageId);

      box?.classList.add('open', 'focus');
      oldBox?.classList.remove('focus');
      svg?.setAttribute('src', emailOpen);
      svg?.setAttribute('alt', 'courrier ouvert');
    }
    setOldId('0');
  }, [messageId]);

  //fonction gérant la fermeture d'un message
  function closeMessage() {
    setIsMailBoxOpen(true);
    setIsMessageOpen(false);
    removeFocus(messageId);
    navigate(`/realtors/${realtorId}`);
  }

  //Hook chargeant les données d'un message
  useEffect(() => {
    const controller = new AbortController();
    if (messageId !== undefined && messageId !== '0') {
      fetchData(
        `http://localhost:8080/realtors/${realtorId}/messages/${messageId}`,
        setMessage,
      );
    }
    return () => controller?.abort();
  }, [messageId]);

  return (
    <div id="App" className="App">
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
              value={realtorId}
              onChange={handleRealtor}
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
      <div id="body" className="body">
        {isMailBoxOpen && (
          <div id="mailBox" className="mailBox">
            {messages.map((element, index) => {
              return (
                <div
                  key={index}
                  id={element.id}
                  className={element.read ? 'App-contact open' : 'App-contact'}
                  ref={messages.length === index + 1 ? lastMessageRef : null}
                  onClick={() => {
                    if (idMessage !== undefined) setOldId(idMessage);
                    displayMail(realtorId, element.id, element.read);
                  }}
                  onKeyDown={() => {
                    onKeyPress(realtorId, element.id, element.read);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="imageMailType">
                    {getImage(element.type, element.read) === 'email' && (
                      <img
                        id={'email' + element.id}
                        src={email}
                        className="emailSvg"
                        alt="courrier fermé"
                      />
                    )}
                    {getImage(element.type, element.read) === 'phone' && (
                      <img src={phone} className="filterColor" alt="téléphone" />
                    )}
                    {getImage(element.type, element.read) === 'emailOpen' && (
                      <img
                        src={emailOpen}
                        className="emailOpenSvg"
                        alt="courrier ouvert"
                      />
                    )}
                  </div>
                  <div className="App-mailInfo">
                    <div className="top-mailInfo">
                      <div className="mailName">
                        {element['contact'].firstname + ' ' + element['contact'].lastname}
                        <div className="contactPhone">({element['contact'].phone})</div>
                      </div>
                      <div className="mailTime">{time(element.date)}</div>
                    </div>
                    <div className="mailSubject">{element.subject}</div>
                    <div className="mailBody">
                      {element.type === 'email'
                        ? element.body.length > 120
                          ? element.body.substring(0, 71) + '...'
                          : element.body
                        : element.subject}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {isMessageOpen ? (
          <div className="App-mail">
            {message.length === 0 ? null : (
              <div className="App-info">
                <div className="closeMessage">
                  <FaRegWindowClose className="closeIcon" onClick={closeMessage} />
                </div>
                <div className="TopInfo">
                  <div className="imageMailOpen">
                    {getImage(message.type, message.read) === 'phone' && (
                      <img src={phone} className="filterColor" alt="téléphone" />
                    )}
                    {getImage(message.type, message.read) === 'emailOpen' && (
                      <img
                        src={emailOpen}
                        className="emailOpenSvg"
                        alt="courrier ouvert"
                      />
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
        ) : !isMobile ? (
          <div className="App-mail">
            <div className="noMail">
              <p>
                Aucun message sélectionné. <br></br> Veuillez en choisir un dans la liste
                pour qu&#39;il soit affiché à l&#39;écran
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Home;
