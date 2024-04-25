import { useState, useEffect } from 'react';

export default function CollectClothes(props) {

  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetch('/api/items/collect');
      const res = await data.json();
      console.log(res);
      setClothes(res);
    }
    getData();
  }, [])

  async function clothesOperation(op, name) {
    let sendPost;
    if (name === undefined) {
      sendPost = await fetch(`api/collect?op=${op}`, {
        method: 'POST',
      });
    } else {
      sendPost = await fetch(`api/collect?op=${op}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
      });
    }
    if (sendPost.ok) {
      const newData = await sendPost.json();
      setClothes(newData);
    } else {
      props.error.current.innerHTML = await sendPost.text();
    }
    await props.resetFunc();
  }

  function formatClothes(clothes) {
    if (clothes.length > 0) {
      return clothes.map((cloth) => {
        return (
          <tr>
            <td className="min-w-12"><button className="p-2 bg-white text-black rounded-full" onClick={() => { clothesOperation('decrement', cloth.name) }}>{cloth.count}</button></td>
            <td className="min-w-20">{cloth.name}</td>
            <td><button className="p-2 bg-white text-black rounded-full text-sm" onClick={() => { clothesOperation('reset', cloth.name) }}>Reset</button></td>
          </tr>
        )
      });
    } else {
      return (
        <tr>
          <td>
            <p className="text-xl">All clothes that have been submitted have been accounted for.</p>
          </td>
        </tr>
      )
    }
  }

  return (
    <table cellspacing="30" className="border-spacing-x-2 border-spacing-y-1 border-separate mb-2">
      {formatClothes(clothes)}
    </table>
  )


}
