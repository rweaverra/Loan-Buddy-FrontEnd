import React, {useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import MakePaymentModal from '../MakePaymentModal/MakePaymentModal';
import {ILoanAgreement} from '../../Utils/Utils';



function LoanAgreement() {


  //***need to make a call to get all transactions, loan Agreement names,  based off loan agreement. 
  // create transactions in backend
  //backend- decide the types of ids, dates, etc. Will need to do some research on this
  // 

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  let params = useParams();

    return (
      <div>
      <h1>Loan Agreement</h1>
      <h2>{params.loanId}</h2>
      <Link to="/">Home</Link>
      <button onClick={handleShow}>Make Payment</button>
      <MakePaymentModal showModal={showModal} handleClose={handleClose}/>
      <ul>
        {/* <li>{loanAgreement.lenderId}</li>
        <li>Borrower: Tim NEED TO GET THIS INFO</li>
        <li>Date: {loanAgreement.dateCreated}</li>
        <li>Initial Amount: {loanAgreement.originalAmount}</li>
        <li>Remaining Amount: {loanAgreement.remainingTotal}</li> */}
        <li>Percentage Rate:</li>
        <li>Current Payoff Date:</li>
      </ul>

      <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>

      </div>
    );
  }
  
  export default LoanAgreement;