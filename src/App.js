import React from 'react'
import './App.css';
import LoadPage from "./AllPages";



function App() {
  return (
      <div>
          <img src={require('../src/layout/images/title.png')} />
     <LoadPage/>
      </div>
  );
}

export default App;

