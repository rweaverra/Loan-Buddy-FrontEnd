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


interface Props {
  loanAgreement: ILoanAgreement
  userId?: string
}


function LoanAgreementOutline({loanAgreement, userId} : Props) {
    return (
        <div className="loanAgreementOutline">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Loan Agreement</Card.Title>
                 <Container>
                    <Row>
                      <Col>                 
                       <div><strong> Original Amount:</strong> ${loanAgreement.originalAmount}</div>
                      <div><strong>Remaining Amount:</strong> ${loanAgreement.remainingTotal}</div>
                      </Col>
                    </Row>
                 </Container>
                <Link to={`/loan-agreement/${loanAgreement.loanAgreementId}/${userId}`} >
                <Button variant="primary">Detailed loan agreement</Button>
                </Link>      
              </Card.Body>
            </Card>
        </div>
      );
 }
  
  export default LoanAgreementOutline;