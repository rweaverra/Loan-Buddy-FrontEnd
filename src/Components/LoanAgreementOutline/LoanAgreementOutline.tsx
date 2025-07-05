import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ILoanAgreement } from '../../Utils/Utils';
import './LoanAgreementOutline.css';

interface Props {
  loanAgreement: ILoanAgreement;
  userId?: string;
}

function LoanAgreementOutline({ loanAgreement, userId }: Props) {
  return (
    <div className="loanAgreementOutline mb-4">
      <Card className="h-100 shadow-sm border-0">
        <Card.Body>
          <Card.Title className="mb-3 text-primary fs-4">
            Loan Agreement #{loanAgreement.loanAgreementId}
          </Card.Title>
          <Container>
            <Row className="mb-2">
              <Col xs={12}>
                <div>
                  <span className="fw-semibold">Original Amount:</span>
                  <span className="ms-2 text-success">${loanAgreement.originalAmount?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="fw-semibold">Remaining Amount:</span>
                  <span className="ms-2 text-danger">${loanAgreement.remainingTotal?.toLocaleString()}</span>
                </div>
              </Col>
            </Row>
            {/* Add more details here if needed */}
          </Container>
          <div className="d-grid mt-3">
            <Link to={`/loan-agreement/${loanAgreement.loanAgreementId}/${userId}`}>
              <Button variant="outline-primary" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoanAgreementOutline;