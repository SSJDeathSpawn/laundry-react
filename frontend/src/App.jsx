import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home'
import Base from './Base'
import Submit from './Submit'
import Collect from './Collect'
import './css/index.css'
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Base><Home /></Base>}></Route>
        <Route path='/submit' element={<Base><Submit /></Base>}></Route>
        <Route path='/collect' element={<Base><Collect /></Base>}></Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
