/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { SetStateAction } from 'react';

export async function getData(
  url: string,
  setData: { (value: any): void; (arg0: any): void },
) {
  await axios
    .get(url)
    .then((res) => res.data)
    .then((data) => {
      setData(data);
    })
    .catch((e) => alert(e.message));
}

export async function getByRealtor(
  realtorId: string | number | undefined,
  setCount: {
    (value: SetStateAction<undefined>): void;
    (arg0: any): void;
  },
) {
  await axios
    .get(`http://localhost:8080/realtors/${realtorId}`)
    .then((res) => res.data)
    .then((data) => {
      setCount(data.unread_messages);
    })
    .catch((e) => alert(e.message));
}

export async function getMail(realtor: any, idMessage: any) {
  await axios
    .patch(`http://localhost:8080/realtors/${realtor}/messages/${idMessage}`, {
      read: true,
    })
    .catch((e) => alert(e.message));
}

export async function getList(
  realtorId: string | number | undefined,
  currentPage: number,
  setMessages: {
    (value: SetStateAction<any[]>): void;
    (arg0: (prev: any) => any[]): void;
  },
  setHasMore: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
) {
  await axios
    .get(
      `http://localhost:8080/realtors/${realtorId}/messages/?page=${currentPage}&page_size=20&sort=date:desc`,
    )
    .then((res) => res.data)
    .then((data) => {
      if (currentPage === 1) {
        setMessages(data);
      } else {
        setMessages((prev: any) => {
          //Permet de garder les données précédentes et d'y ajouter les nouvelles
          return [...new Set([...prev, ...data])];
        });
      }
      setHasMore(data.length > 0);
      setLoading(false);
    })
    .catch((e) => alert(e.message));
}
