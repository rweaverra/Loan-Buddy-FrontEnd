import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {ITransaction, TransactionType, ThirdPartyApp} from '../../Utils/Utils.js';
import { assertOrUndefined } from 'pdf-lib';

type Props = {
    showModal: boolean;
    handleClose: () => void;
    submitTransaction: (transaction : ITransaction) => void;
  }

 //i need to send showmodal and loanAgreementId

function MakePaymentModal({showModal, handleClose, submitTransaction}: Props) {

  const [inputs, setInputs] = useState<ITransaction>({});
  const [showThirdPartyApps, setShowThirdPartyApps] = useState<boolean>(false);


  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  const handleTransactionSelectChange = (e : React.ChangeEvent<HTMLSelectElement>) => {

     if (e.target.value == "ThirdPartyApp") {
       setShowThirdPartyApps(true)      
    } else {
      setInputs({...inputs, thirdPartyApp: "" as ThirdPartyApp});
      setShowThirdPartyApps(false); 
    }

    setInputs({ ...inputs, [e.target.name]: e.target.value as TransactionType });
  };

  const handleThirdPartySelectChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
   setInputs({ ...inputs, [e.target.name]: e.target.value as ThirdPartyApp });
 };

    return (
        <div>
         <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Record Monthly Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control name="amount" value={inputs.amount} onChange={handleChange} type="number" placeholder="Enter Amount" />                  
          </Form.Group>
          <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select defaultValue="" className="form-control" name="transactionType" value={inputs.transactionType} onChange={handleTransactionSelectChange}>
                        <option value={undefined}>Choose...</option>
                        <option value="Cash">Cash</option>
                        <option value="Check">Check</option>
                        <option value="ThirdPartyApp">Third Party App</option>
                        <option value="Other">Other</option>
              </Form.Select>
          </Form.Group>
         {showThirdPartyApps &&  <Form.Group className="mb-3">
              <Form.Label>Third Party Apps</Form.Label>
              <Form.Select defaultValue="" className="form-control" name="thirdPartyApp" value={inputs.thirdPartyApp} onChange={handleThirdPartySelectChange}>
                        <option value={undefined}>Choose...</option>
                        <option value="Venmo">Venmo</option>
                        <option value="Zelle">Zelle</option>
                        <option value="PayPal">Pay Pal</option>
                        <option value="Other">Other</option>
              </Form.Select>
          </Form.Group>}
          <Form.Group className="mb-3">
              <Form.Label>if proof is required, upload file</Form.Label>
              <Form.Control name="requiresProofOfPayment" type="file" placeholder="upload file" />                  
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => submitTransaction(inputs)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
      );
 }
  
  export default MakePaymentModal;