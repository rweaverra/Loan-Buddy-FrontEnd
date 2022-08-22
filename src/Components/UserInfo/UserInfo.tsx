import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import LoanAgreementOutline from '../LoanAgreementOutline/LoanAgreementOutline';
import {ILoanAgreement, IUserInfo} from '../../Utils/Utils';
import getAllUserData from '../../Utils/AjaxRequests';

function UserInfo() {
  const [userData, setUserData] = useState<IUserInfo>();
  const [loanAgreements, setLoanAgreements] = useState<ILoanAgreement[]>([]);


   const params = useParams();
  const userId = params.userId as string;

  async function getdata() {
    //could make get AllUserData a request OBject so We Know what it is doing.
    var results = await getAllUserData(userId);

    setUserData(results.userInfo);
    setLoanAgreements(results.loanAgreements);
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
        <button><Link to={`/loan-agreement-create/${userId}`} >Create new Loan Agreement</Link> </button>

      </div>
    );
  }
}
  export default UserInfo;