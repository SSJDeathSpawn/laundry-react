import CollectClothes from './components/CollectClothes';
import { useRef, useState } from 'react';

export default function Collect() {
  const errReference = useRef(null);
  const finishReference = useRef(null);

  const [confirm, setConfirm] = useState(false);

  async function done() {
    if (confirm) {
      const sendPost = await fetch('/api/finish', { method: 'POST' });
      if (sendPost.ok) {
        window.location.reload();
      } else {
        errReference.current.innerHTML = await sendPost.text();
        finishReference.current.innerHTML = "Done Counting"
        setConfirm(false);
      }
    } else {
      finishReference.current.innerHTML = "Are you sure?"
      setConfirm(true);
    }
  }

  async function reset() {
    finishReference.current.innerHTML = "Done Counting"
    setConfirm(false);
  }

  return (
    <>
      <h1 className="text-5xl mb-4">Collect Clothes</h1>
      <hr className="mb-2"/>
      <CollectClothes error={errReference} resetFunc={reset} />
      <p className="text-rose-400 ml-2 mb-5 text-xl font-bold " id="error" ref={errReference}></p>
      <button className="ml-2 border-indigo-200 hover:text-gray-900 bg-gray-900 transition duration-300 hover:bg-indigo-200 border-2 p-2 rounded-3xl" ref={finishReference} onClick={done}>Done Counting</button>
    </>
  )
}
