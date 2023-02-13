/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

async function getData(url: string, setData: { (value: any): void; (arg0: any): void }) {
  await axios
    .get(url)
    .then((res) => res.data)
    .then((data) => {
      setData(data);
    })
    .catch((e) => alert(e.message));
}

export default getData;
