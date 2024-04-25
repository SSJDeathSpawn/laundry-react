import Nav from './components/Nav'
import { motion } from 'framer-motion'
import './css/base.css'

export default function Base(props) {
	return (
		<>
			<Nav />
			<motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className="m-5 text-indigo-200">
					{props.children}
				</div>
			</motion.div>
		</>
	)
}
