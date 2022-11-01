import './App.css';
import React, { useEffect, useState } from 'react';
import API from './api/api';

function App() {

  const [ displayText, setDisplayText ] = useState("Oh no it's not working :(")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/');
        setDisplayText(response.data);
      } catch (err) {
        console.log(err);
        setDisplayText(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{displayText}</h1>
      </header>
    </div>
  );
}

export default App;
