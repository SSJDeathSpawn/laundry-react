import {Routes, Route} from 'react-router-dom';
import Home from './Home.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path=''></Route>
    </Routes>
  );
}

export default App;
