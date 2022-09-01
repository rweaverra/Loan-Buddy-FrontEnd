

import React, {useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import getAllUserData from '../../Utils/AjaxRequests';
import SignatureAndPDF from '../SignatureAndPDF/SignatureAndPDF';
import { IUserInfo, ILoanAgreement} from '../../Utils/Utils';
import './LoanAgreementCreate.css';

import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

 type TypeOfLoan = "borrow" | "lend" | "";

function LoanAgreementCreate() {
  const [userInfo, setUserInfo] = useState<IUserInfo>({});
  const [typeOfLoan, setTypeOfLoan] = useState<TypeOfLoan>("");
  const [loanDetails, setLoanDetails] = useState<ILoanAgreement>({});
  const [otherPartyInfo, setOtherPartyInfo] = useState<IUserInfo>({}); 
  const [pdfUrl, setPdfUrl] = useState<string>(""); //stays
  const [showSigComponent, setShowSigComponent] = useState<boolean>(false);

  const [borrowBtnClicked, setBorrowBtnClicked] = useState<boolean>(false);
  const [lendBtnClicked, setLendBtnClicked] = useState<boolean>(false);

  const sigProps = { 
    pdfUrl: pdfUrl,
    otherParty: false,
    setThePdfUrl: setThePdfUrl,
    loanIsSigned: loanIsSigned,
    saveAndEmailAgreement: saveAndEmailAgreement
  }
  

  const params = useParams();
  const userId = params.userId || "";  //as string

  function loanIsSigned() {
    let signedBy = typeOfLoan === "borrow" ?  "SignedByBorrower" : "SignedByLender";
 
    setLoanDetails({
        ...loanDetails,
        [signedBy]: true,
        requiresSignatures: true
    })
  }

  function setThePdfUrl(pdfUrl: string) {
    setPdfUrl(pdfUrl);
  }
  
  async function getdata() {
    var results = await getAllUserData(userId); 
    setUserInfo(results.userInfo);
  }

  const handleChangeLoanDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    let correctTargetType = e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
   
    setLoanDetails({
      ...loanDetails,
      [e.target.name]: correctTargetType
    })
  }

  const handleChangeOtherParty = (e: React.ChangeEvent<HTMLInputElement> ) => {
  
    setOtherPartyInfo({
      ...otherPartyInfo,
      [e.target.name]: e.target.value
    })
  }

  function setLoanType(loanType : TypeOfLoan) {
    setTypeOfLoan(loanType);
    
  }

  function submitForm() {
    buildPDF();
  }

  //I think PDF Creation stays on LoanAgreementCreate then pass it down.
  function buildPDF() {
    const doc = new window.jsPDF();
    doc.fromHTML(document.getElementById("pdf"));
    
    //I could possible change this to a base64string?
    var pdf = doc.output('bloburl');
    console.log("pdf Bloburl", pdf);
    setPdfUrl(pdf);
    setShowSigComponent(true);

  }


  useEffect(() => {
    getdata(); 
    }, []); 

  async function submitFinishedLoanAgreement() {   
    //remove extra data from PDF base64 string
    let pdfString = pdfUrl.substring(28);

    const requestBody = {
            userInfo: userInfo,
            otherPartyInfo: otherPartyInfo,
            loanDetails: loanDetails,
            pdfBase64String: pdfString,
            typeOfLoan: typeOfLoan  
    } 

    const requestString = JSON.stringify(requestBody);

    const response = await fetch(`https://localhost:7055/LoanAgreement/SubmitNewLoanAgreement`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
        body: requestString
    });
    const result = await response.json();
    console.log("Loan Agreement Submitted: ", result);
    //take back to loan Agreement
    const loanId = result.data.loanAgreementId as string;

    
    window.location.href = `../loan-agreement/${loanId}/${userId}`;
    

  }

  

  function loanTypeSelected(loanType : TypeOfLoan){
    //set loan type
    if (loanType == "borrow"){
        setLoanType("borrow");
        setLoanDetails({
            ...loanDetails,
            loanCreator: "borrower",
        })
        setBorrowBtnClicked(true);
        setLendBtnClicked(false);
      
    } else if (loanType == "lend") {
        setLoanType("lend");
        setLoanDetails({
            ...loanDetails,
            loanCreator: "lender",
        })
        setLendBtnClicked(true);
        setBorrowBtnClicked(false);
    }
  }

    function saveAndEmailAgreement() {
        submitFinishedLoanAgreement();               
    }

    if(!userInfo) return <div>loading...</div>

    return (
        <div className="container mainBody">
            
             {showSigComponent &&<SignatureAndPDF {...sigProps}/>}
            <h4>Create Loan Agreement</h4>
            <div>{userInfo.name}</div>
            <br></br>
            <span>
            <button className={`${borrowBtnClicked ? "loanTypeBtnClicked " : "" } btn btn-outline-success borrowBtn`}  onClick={() => loanTypeSelected("borrow")}>Borrow Money</button>
            <button className={`${lendBtnClicked ? "loanTypeBtnClicked " : "" } btn btn-outline-success lendBtn` } onClick={() => loanTypeSelected("lend")}>Lend Money</button>
            </span>
            <br></br>
            {typeOfLoan.length > 0 && <div>
            <h3>{typeOfLoan === "borrow" ? "Borrower Name:" : "Lender Name:"} {userInfo.name}</h3>
            <form>
                <div className="form-group">
                    <div className="row">
                        <label className="col">{typeOfLoan === "borrow" ? "Lender Name" : "Borrower Name"}</label>
                        <input name="name" value={otherPartyInfo.name} onChange={handleChangeOtherParty} type="text" className="col" aria-describedby="lendername"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">{typeOfLoan === "borrow" ? "Lender Email" : "Borrower Email"}</label>
                        <input name="email" value={otherPartyInfo.email} onChange={handleChangeOtherParty} type="text" className="col" aria-describedby="lenderemail"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Amount</label>
                        <input name="originalAmount" value={loanDetails.originalAmount} onChange={handleChangeLoanDetails} type="number" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Monthly Payment</label>
                        <input name="monthlyPayment" value={loanDetails.monthlyPaymentAmount} onChange={handleChangeLoanDetails} type="number" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Interest %</label>
                        <input name="interestPercentage" value={loanDetails.interestPercentage} onChange={handleChangeLoanDetails} type="text" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Payback Date</label>
                        <input name="paybackDate" value={loanDetails.paybackDate} onChange={handleChangeLoanDetails} type="date" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>       
                <button type="button" className="btn btn-primary" onClick={submitForm}>Generate Loan PDF</button>
                <button type="button" className="btn btn-primary" >Create Loan Agreement Without Signatures</button>
            </form>  

         {/* HTML FORMAT FOR PDF, MAYBE MOVE TO ITS OWN HTML PAGE? */}
            <div id="pdf" style={{display:"none"}}>
                <div>The lender {typeOfLoan === "lend" ? userInfo.name : otherPartyInfo.name}  <br></br>
                 agrees to lend the borrower {typeOfLoan === "lend" ? otherPartyInfo.name : userInfo.name} <br></br>
                for the amount of ${loanDetails.originalAmount}</div>

                <div>The borrower aggrees to make monthly payments of  ${loanDetails.monthlyPaymentAmount} <br></br>
                which includes an additional interest amount of a yearly interest rate of {loanDetails.interestPercentage}%. <br></br>
                These payments will be made until the loan is paid off.</div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div>{typeOfLoan === "borrow" ? `borrower signature`: `lender signature`} {userInfo.name}:_________________________________</div><div className="sigBox"></div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div>{typeOfLoan === "borrow" ? `lender signature` : `borrower signature`} {otherPartyInfo.name}:_________________________________</div><div className="sigBox"></div>
            </div>
           </div> }
        </div>
    )
    
}


export default LoanAgreementCreate;

