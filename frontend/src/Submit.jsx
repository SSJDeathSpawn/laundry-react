import { useRef } from 'react';
import SubmitClothes from './components/SubmitClothes';

export default function Submit() {

	const errReference = useRef(null);

	function copyToClipboard() {
		fetch("/api/copy").then(response => {
			response.text().then(text => {
				console.log(text);
				navigator.clipboard.writeText(text);
			});
		});
	}

	async function submitClothes() {
		const sendPost = await fetch("api/submit", {
			method: 'POST'
		})
		if (!sendPost.ok) {
			errReference.current.innerHTML = await sendPost.text()
		}
	}

	return (
		<>
			<h1 className="text-5xl mb-4">Submit Clothes</h1>
			<hr className="mb-2"/>
			<SubmitClothes error={errReference} />
			<p className="text-rose-400 ml-2 mb-5 text-xl font-bold " id="error" ref={errReference}></p>
			<button onClick={() => { copyToClipboard() }} className="ml-2 border-indigo-200 hover:text-gray-900 bg-gray-900 transition duration-300 hover:bg-indigo-200 border-2 p-2 rounded-3xl">Copy Text</button>
			<button onClick={() => { submitClothes() }} className="ml-2 border-indigo-200 hover:text-gray-900 bg-gray-900 transition duration-300 hover:bg-indigo-200 border-2 p-2 rounded-3xl">Submit Clothes</button>
		</>
	)
}
