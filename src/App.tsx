import './App.css';
import Chessboard from './components/Chessboard/Chessboard';
import RoomPage from './RoomPage/RoomPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ErrorPage from './RoomPage/ErrorPage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path='/' element={<RoomPage/>}> </Route>
        <Route path='/Chessboard' element={<Chessboard/>}> </Route>
        <Route path='/*' element={<ErrorPage/>}> </Route>
      </Routes>
    </Router>
  );
}

export default App;