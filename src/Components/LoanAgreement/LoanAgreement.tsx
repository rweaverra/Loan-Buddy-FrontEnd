import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function LoanAgreement() {

  let params = useParams();

    return (
      <div>
      <h1>Loan Agreement</h1>
      <h2>{params.loanId}</h2>
      <Link to="/">Home</Link>
      <ul>
        <li>Lender: Bill</li>
        <li>Borrower: Tim</li>
        <li>Date:</li>
        <li>Initial Amount:</li>
        <li>Remaining Amount:</li>
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