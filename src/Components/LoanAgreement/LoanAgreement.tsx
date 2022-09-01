import React, {useState, useEffect, useRef} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import jsPDF from "jspdf";
import MakePaymentModal from '../MakePaymentModal/MakePaymentModal';
import SignatureAndPDF from '../SignatureAndPDF/SignatureAndPDF';
import {ILoanAgreement, ITransaction, IUserInfo} from '../../Utils/Utils';
import Table from '../Table/Table';
import "./LoanAgreement.css";
import { PDFDocument } from 'pdf-lib';
import { reduceEachLeadingCommentRange } from 'typescript';

type TypeOfLoan = "borrow" | "lend" | "";

function LoanAgreement() {
  const [currentUser, setCurrentUser] = useState<IUserInfo>({});
  const [borrowerInfo, setBorrowerInfo] = useState<IUserInfo>({});
  const [lenderInfo, setLenderInfo] = useState<IUserInfo>({});
  const [typeOfLoan, setTypeOfLoan] = useState<TypeOfLoan>("");
  const [loanAgreementDetails, setLoanAgreementDetails] = useState<ILoanAgreement>({});
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [showSigComponent, setShowSigComponent] = useState<boolean>(false);
  const [needsSignature, setNeedsSignature] = useState<boolean>(true);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [secondPartyNeedsSig, setSecondPartyNeedsSig] = useState<boolean>(false);
  const headers : string[] = ["amount", "transactionType", "date", "remainingTotal"];
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  let params = useParams();
  let userId = params.userId; 
  let loanId = params.loanId;

  
  const sigProps = { 
    pdfUrl: pdfUrl,
    otherParty: true,
    setThePdfUrl: setThePdfUrl,
    loanIsSigned: loanIsSigned,
    saveAndEmailAgreement: saveAndEmailAgreement
  }

  async function getdata() {
    try {
      const response = await fetch(`https://localhost:7055/LoanAgreement/getAllLoanInfo/${params.loanId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      initializeData(result);
           
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getdata();      
}, []); 

function initializeData(result : any) {

   const loanAgreementData = result.data.loanAgreement;
   const pdfBase64String = result.data.pdfBase64String;
   console.log("fetching result: ", result);
   setLoanAgreementDetails(loanAgreementData);
   setBorrowerInfo(loanAgreementData.borrowerDetail);
   setLenderInfo(loanAgreementData.lenderDetail);
   setTransactions(loanAgreementData.transactions);
   

  //update signauture requests make function
   if(userId == loanAgreementData.borrowerDetail.userId){
     setCurrentUser(loanAgreementData.borrowerDetail);
     setTypeOfLoan("borrow");

     if(loanAgreementData.requiresSignatures) {
       if(loanAgreementData.signedByBorrower) 
        setNeedsSignature(false);

       if(loanAgreementData.loanCreator == "borrower" && !loanAgreementData.signedByLender) 
        setSecondPartyNeedsSig(true);

     }


   } else if (loanAgreementData.lenderDetail.userId){
     setCurrentUser(loanAgreementData.lenderDetail);
     setTypeOfLoan("lend");

     if(loanAgreementData.requiresSignatures) {
       if(loanAgreementData.signedByLender)
        setNeedsSignature(false);

    }

   }
   
   var concat = "data:application/pdf;base64," + pdfBase64String;
    setPdfUrl(concat);
}

function openSigAndPdf() {
  setShowSigComponent(true);
}

function setThePdfUrl(pdfUrl: string) {
  setPdfUrl(pdfUrl);
}

function loanIsSigned() {
  let signedBy = typeOfLoan === "borrow" ?  "SignedByBorrower" : "SignedByLender";

  setLoanAgreementDetails({
      ...loanAgreementDetails,
      [signedBy]: true
  })
}

function saveAndEmailAgreement() {
 submitFinishedLoanAgreement();
 setShowSigComponent(false);  
 setNeedsSignature(false);            
}

async function submitFinishedLoanAgreement() {   
  //remove extra data from PDF base64 string
  let pdfString = pdfUrl.substring(28);

  const requestBody = {
          userInfo: currentUser,
          loanDetails: loanAgreementDetails,
          pdfBase64String: pdfString,
          typeOfLoan: typeOfLoan  
  } 

  const requestString = JSON.stringify(requestBody);

  const response = await fetch(`https://localhost:7055/LoanAgreement/SubmitSecondSigLoanAgreement`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json;charset=utf-8'
  },
      body: requestString
  });
  const result = await response.json();
  console.log("SubmitNewLoanAgreementResult: ", result);
}

async function submitTransaction(transaction: ITransaction) {

  transaction.loanAgreementId = loanAgreementDetails.loanAgreementId;


  const requestString = JSON.stringify(transaction);

  const response = await fetch(`https://localhost:7055/Transaction/PostTransaction`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
     },
    body: requestString
  });

  const result = await response.json();
  console.log("Submittedtransaction: ", result);
  handleClose();
  transactions.push(result.data);
 
  //function to update remaining total
  let remainingTotal = loanAgreementDetails.remainingTotal;
  if(loanAgreementDetails.remainingTotal && transaction.amount){
    remainingTotal = loanAgreementDetails.remainingTotal - transaction.amount;
  }

  setLoanAgreementDetails({
    ...loanAgreementDetails,
    remainingTotal: remainingTotal
})

  //update the transaction table.
}
  


if(!loanAgreementDetails.loanAgreementId) return <div>loading...</div>

    return (
      <div>
        <h1>Loan Agreement</h1>
        <h2>loan Id: {params.loanId}</h2>
        <Link to={`/user-info/${userId}`} >
        <button className="btn btn-success" >Home</button>
        </Link>
        <button className="btn btn-primary"onClick={handleShow}>Make Payment</button>
        { secondPartyNeedsSig && <h5 style={{color: "red"}}> requires other party's signature </h5>}
        {showSigComponent &&<SignatureAndPDF {...sigProps}/>}
        {needsSignature && <button className="btn btn-primary" onClick={openSigAndPdf}>view and sign Loan Agreement</button>}

        <Card style={{ width: '18rem', margin: "auto"}}>
          <ListGroup>
            <ListGroup.Item><strong>Lender:</strong> {lenderInfo.name}</ListGroup.Item>
            <ListGroup.Item><strong>Borrower:</strong> {borrowerInfo.name}</ListGroup.Item>
            <ListGroup.Item><strong>Date:</strong> {loanAgreementDetails.dateCreated}</ListGroup.Item>
            <ListGroup.Item><strong>Original Amount:</strong> ${loanAgreementDetails.originalAmount}</ListGroup.Item>
            <ListGroup.Item><strong>Remaining Amount:</strong> ${loanAgreementDetails.remainingTotal}</ListGroup.Item>
            <ListGroup.Item><strong>Percentage Rate:</strong> {loanAgreementDetails.interestPercentage}%</ListGroup.Item>
          </ListGroup>
        </Card>
        <MakePaymentModal submitTransaction={submitTransaction} showModal={showModal} handleClose={handleClose}/>
        <Table headers={headers} transactions={transactions}/>
      </div>
    );
  }
  
  export default LoanAgreement;