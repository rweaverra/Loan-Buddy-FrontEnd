import React from 'react';
import UserInfo from './Components/UserInfo/UserInfo';
import './App.css';
import LoanAgreement from './Components/LoanAgreement/LoanAgreement';
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserInfo />} />
        <Route path="loan-agreement/:loanId" element={<LoanAgreement />} />
      </Routes>
    </div>


  );
}



export default App;
