import React, {useState, useEffect} from 'react';
import internal from 'stream';
import LoanAgreementOutline from '../LoanAgreementOutline/LoanAgreementOutline';
import {ILoanAgreement} from '../../Utils/Utils';

function UserInfo() {
  const [userData, setUserData] = useState({});
  const [loanAgreements, setLoanAgreements] = useState<ILoanAgreement[]>([]);

 
  const userId = 1; //will change after login page created


//should grab the user info(name, email, etc)
//should grab the initial loan agreement info(name, amount, etc.)
//so then should I have one function that grabs all of this??
  async function getdata() {
    try {
      const response = await fetch(`https://localhost:7055/LoanAgreement/${userId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("fetching result: ", result);
      setLoanAgreements(result);
    } catch (err) {
      console.log(err);
    }
  }

      

  useEffect(() => {
      getdata();      
  }, []); 


  const loanAgreement = loanAgreements.map((loan, i) => {
      return (
        <LoanAgreementOutline loanAgreement={loan} key={i}/>
      )
  });

  if(loanAgreements.length == 0) {
    return <div>loading...</div>
  } else {
    //repeat the loan aggreement Outlines
      //then each loan aggreementOutline will call and get the transaction data?
  return (
      <div>
        <h2>Ryan Weaver's Loans</h2>
        {loanAgreement}
        {/* <LoanAgreementOutline loanAgreements={loanAgreements}></LoanAgreementOutline> */}
        <br></br>
        <br></br>
        <button>New Loan</button>
      </div>
    );
  }
}
  export default UserInfo;