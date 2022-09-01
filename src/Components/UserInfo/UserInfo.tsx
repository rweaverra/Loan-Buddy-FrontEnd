import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import LoanAgreementOutline from '../LoanAgreementOutline/LoanAgreementOutline';
import {ILoanAgreement, IUserInfo} from '../../Utils/Utils';
import getAllUserData from '../../Utils/AjaxRequests';

function UserInfo() {
  const [userData, setUserData] = useState<IUserInfo>({});
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
        <LoanAgreementOutline loanAgreement={loan} userId={userId} key={i}/>
      )
  });

  if(loanAgreements.length == 0) {
    return <div>loading...</div>
  } else {
  return (
      <div>
        <h2>Ryan Weaver's Loans</h2>
        {loanAgreement}
        <br></br>
        <br></br> 
        <Link to={`/loan-agreement-create/${userId}`} >
          <button className='btn btn-warning'>Create new Loan Agreement</button>
        </Link> 

      </div>
    );
  }
}
  export default UserInfo;