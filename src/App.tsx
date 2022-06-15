//import { hot } from 'react-hot-loader/root';
import Chessboard from './components/Chessboard/Chessboard';
import RoomPage from './components/RoomPage/RoomPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ErrorPage from './components/ErrorPage/ErrorPage';
import NewChessboard from './components/NewChessboard/NewChessboard';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<RoomPage/>}> </Route>
          <Route path='/chessboard' element={<NewChessboard/>}> </Route>
          <Route path='/*' element={<ErrorPage/>}> </Route>
      </Routes>
    </Router>
  );
}

export default (App);