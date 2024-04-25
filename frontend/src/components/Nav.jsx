import {NavLink} from 'react-router-dom'

export default function Nav() {
  return (
    <ul className="pl-2 nav bg-gray-700 text-indigo-200 inter-bold text-lg">
			<li><NavLink to="/">Home</NavLink></li>
			<li><NavLink to="/submit">Submit</NavLink></li>
			<li><NavLink to="/collect">Collect</NavLink></li>
		</ul>
  )
}
