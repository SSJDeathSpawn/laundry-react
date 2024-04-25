import History from './components/History'

export default function Home() {
  return ( 
    <>
      	<h1 className="text-5xl mb-4">Laundry Tracker</h1>
	<hr/>
	<p className="text-2xl mt-4">For you laundry tracking needs.</p>
	<h2 className="text-3xl mt-7 mb-4 font-bold">History</h2>
	<History/>
    </>
  )
}

