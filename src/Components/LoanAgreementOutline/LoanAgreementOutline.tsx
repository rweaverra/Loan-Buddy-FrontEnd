import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {ILoanAgreement} from '../../Utils/Utils';
import './LoanAgreementOutline.css';
// import './App.css';

interface Props {
  loanAgreement: ILoanAgreement
  userId?: string
}


function LoanAgreementOutline({loanAgreement, userId} : Props) {
    return (
        <div className="loanAgreementOutline">
            <Card className="text-center">
              {/* <Card.Header>Loan Id: {loanAgreement.loanAgreementId}</Card.Header> */}
              <Card.Body>
                <Card.Title>Loan Agreement</Card.Title>
                <Card.Text>
                 <Container>
                    <Row>
                      {/* <Col>
                        <ListGroup>                     
                          <ListGroup.Item><strong>Lender:</strong> {loanAgreement.loanAgreementId}</ListGroup.Item>
                          <ListGroup.Item><strong>Borrower:</strong> {loanAgreement.borrowerId}</ListGroup.Item>
                        </ListGroup>
                      </Col> */}
                      <Col>
                   
                       <div><strong> Original Amount:</strong> ${loanAgreement.originalAmount}</div>
                      <div><strong>Remaining Amount:</strong> ${loanAgreement.remainingTotal}</div>

                      </Col>
                    </Row>
                 </Container>
                </Card.Text>
                <Link to={`/loan-agreement/${loanAgreement.loanAgreementId}/${userId}`} >
                <Button variant="primary">Detailed loan agreement</Button>
                </Link>      
              </Card.Body>
              <Card.Footer className="text-muted">date Created: {loanAgreement.dateCreated}</Card.Footer>
            </Card>
          {/* <h3>Loan Agreements</h3>
          <div>Loan Id: {loanAgreement.loanAgreementId}</div>
          <div>Lender: {loanAgreement.lenderId}</div>
          <div>Borrower: {loanAgreement.borrowerId}</div>
          <div>Amount: {loanAgreement.originalAmount}</div>
          <div>Monthly Payment: {loanAgreement.monthlyPaymentAmount}</div>
          <div>Interestt: {loanAgreement.dateCreated}</div> */}
        </div>
      );
 }
  
  export default LoanAgreementOutline;