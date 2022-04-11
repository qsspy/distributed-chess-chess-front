import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>REACT_APP_ROOM_SERVICE_ADDRESS : {process.env.REACT_APP_ROOM_SERVICE_ADDRESS}</p>
        <p>REACT_APP_CHESS_COMMAND_ADDRESS : {process.env.REACT_APP_CHESS_COMMAND_ADDRESS}</p>
        <p>REACT_APP_CHESS_EVENT_ADDRESS : {process.env.REACT_APP_CHESS_EVENT_ADDRESS}</p>
      </header>
    </div>
  );
}

export default App;
