import { useEffect, useState } from "react";


export default function SubmitClothes(props) {

  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetch('/api/items/submit');
      const res = await data.json();
      console.log(res);
      setClothes(res);
    }
    getData();
  }, [])

  async function clothesOperation(op, name) {
    let sendPost;
    if (name === undefined) {
      sendPost = await fetch(`api/new?op=${op}`, {
        method: 'POST',
      });
    } else {
      sendPost = await fetch(`api/new?op=${op}`, {
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
  }

  async function nameChange(oldName, newName) {
    let sendPost;
    sendPost = await fetch(`api/new?op=change`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({[oldName]: newName})
    });
    if (sendPost.ok) {
      const newData = await sendPost.json();
      setClothes(newData);
    } else {
      props.error.current.innerHTML = await sendPost.text();
    }
  }

  function formatClothes(clothes) {
    if (clothes.length > 0) {
      return clothes.map((cloth) => {
        return (
          <tr>
            <td><button onClick={() => { clothesOperation('decrement', cloth.name) }} className="p-2 bg-white text-black rounded-full">-</button></td>
            <td className="p-2 bg-white text-black rounded-full">{cloth.amt}</td>
            <td><button onClick={() => { clothesOperation('increment', cloth.name) }} class="p-2 bg-white text-black rounded-full">+</button></td>
            <td><input className="text-black p-2 rounded-full" onChange={(event) => { nameChange(cloth.name, event.target.value) }} name={cloth.name} value={cloth.name} /><br /></td>
          </tr>
        )
      });
    } else {
      return (
        <tr>
          <td>
            <p className="text-xl">Add clothes by pressing the + button.</p>
          </td>
        </tr>
      )
    }
  }

  return (
    <table cellspacing="30" class="border-spacing-x-2 border-spacing-y-1 border-separate mb-2">
      {formatClothes(clothes)}
      <tr>
        <td colspan="4" align="center">
          <button onClick={() => { clothesOperation('new') }} className="mb-4 border-indigo-200 hover:text-gray-900 bg-gray-900 transition duration-300 hover:bg-indigo-200 border-2 px-2 py-1 rounded-3xl">+</button>
        </td>
      </tr>
    </table>
  )


}
