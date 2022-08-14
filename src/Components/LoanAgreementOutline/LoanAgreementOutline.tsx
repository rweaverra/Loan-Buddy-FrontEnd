import React from 'react';
import { Link } from 'react-router-dom';
import {ILoanAgreement} from '../../Utils/Utils';
import './LoanAgreementOutline.css';
// import './App.css';

interface Props {
  loanAgreement: ILoanAgreement
}


function LoanAgreementOutline({loanAgreement} : Props) {
    return (
        <div className="loanAgreementOutline">
            <nav>
            <Link to={`/loan-agreement/${loanAgreement.loanAgreementId}`} >Detailed loan agreement</Link>
            </nav>
          <h3>Loan Agreements</h3>
          <div>Loan Id: {loanAgreement.loanAgreementId}</div>
          <div>2. Lender: {loanAgreement.lenderId}</div>
          <div>3. Borrower, {loanAgreement.borrowerId}</div>
          <div>4. Amount, {loanAgreement.originalAmount}</div>
          <div>5. Monthly Payment, {loanAgreement.monthlyPaymentAmount}</div>
          <div>6. Interestt, {loanAgreement.dateCreated}</div>
        </div>
      );
 }
  
  export default LoanAgreementOutline;