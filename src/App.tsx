import { hot } from 'react-hot-loader/root';
import Chessboard from './components/Chessboard/Chessboard';
import RoomPage from './components/RoomPage/RoomPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ErrorPage from './components/ErrorPage/ErrorPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<RoomPage/>}> </Route>
          <Route path='/Chessboard' element={<Chessboard/>}> </Route>
          <Route path='/*' element={<ErrorPage/>}> </Route>
      </Routes>
    </Router>
  );
}

export default hot(App);