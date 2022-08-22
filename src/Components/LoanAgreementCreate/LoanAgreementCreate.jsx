import { userInfo } from 'os';
import React, {useState, useEffect, useRef} from 'react';
import { Link, useParams } from 'react-router-dom';
import getAllUserData from '../../Utils/AjaxRequests';
import { IUserInfo} from '../../Utils/Utils';
import './LoanAgreementCreate.css';
import jsPDF from "jspdf";
import SignaturePad from 'signature_pad';

function LoanAgreementCreate() {
  const [userInfo, setUserInfo] = useState({});
  const [typeOfLoan, setTypeOfLoan] = useState("");
  const [loanDetails, setLoanDetails] = useState({});
  const [pdfUrl, setPdfUrl] = useState("");
  const [showSignPad, setShowSignPad] = useState(false);
   const myRef = useRef(null);

  const params = useParams();
  const userId = params.userId;  //as string
  
  async function getdata() {
    var results = await getAllUserData(userId);   
    setUserInfo(results.userInfo);
  }

  const handleChange = (e) => {
    setLoanDetails({
      ...loanDetails,
      [e.target.name]: e.target.value
    })
}

  function setLoanType(e) {
    setTypeOfLoan(e.target.name);
    console.log("setLoanType event: ", e);
  }

  function submitForm(e) {
    e.preventDefault();
    buildPDF();
    // createLoanAgreement();
    console.log("submitting form to server loanDetials: ", loanDetails);
  }

  function buildPDF() {
    console.log("Building PDF");

    const doc = new window.jsPDF();
    doc.fromHTML(document.getElementById("test"));

    var pdf = doc.output('bloburl');
    setPdfUrl(pdf);
    console.log("pdf document: ", pdf);
  }

  function signAgreement() {
    setShowSignPad(true);
  }
  
  useEffect(() => {
    getdata(); 
    
    }, []); 

    async function createLoanAgreement() {
          const requestBody = {
            user: userInfo,
            loanDetails: loanDetails
          }
          const response = await fetch(`https://localhost:7055/LoanAgreement/LoanAgreementCreate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(requestBody)
          });
          const result = await response.json();
      }


      ///SIGNATURE PAD EX
      if(myRef.current){
        console.log("myRef: ", myRef);
        //my ref is basically document.getElementById, but has to be done after element is rendered.
        const signaturePad = new SignaturePad(myRef.current);
    }
    
      //END SIGNATURE PAD

    if(!userInfo) return <div>loading...</div>

    return (
        <div className="container">

            {pdfUrl && <div>
                <iframe src={pdfUrl} />
                <button className="btn btn-primary" onClick={signAgreement}>Sign Agreement</button>
                </div>}
               <canvas ref={myRef} style={{ display: showSignPad ? "block" : "none" }} width="400" height="200"></canvas>
            <h4>Create Loan Agreement</h4>
            <div>{userInfo.name}</div>
            <br></br>
            <span>
            <button className="btn btn-success" name="borrow" onClick={setLoanType}>Borrow Money</button>
            <button className="btn btn-success" name="lend" onClick={setLoanType}>Lend Money</button>
            </span>
            <br></br>
            <h3>{typeOfLoan === "borrow" ? "Borrower Name:" : "Lender Name:"} {userInfo.name}</h3>
            <form>
                <div className="form-group">
                    <div className="row">
                        <label className="col">{typeOfLoan === "borrow" ? "Lender Name" : "Borrower Name"}</label>
                        <input name="name" value={loanDetails.name} onChange={handleChange} type="text" className="col" aria-describedby="lendername"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">{typeOfLoan === "borrow" ? "Lender Email" : "Borrower Email"}</label>
                        <input name="email" value={loanDetails.email} onChange={handleChange} type="text" className="col" aria-describedby="lenderemail"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Amount</label>
                        <input name="amount" value={loanDetails.amount} onChange={handleChange} type="text" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Monthly Payment</label>
                        <input name="monthlyPayment" value={loanDetails.monthlyPayment} onChange={handleChange} type="text" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Interest %</label>
                        <input name="interestPercentage" value={loanDetails.interestPercentage} onChange={handleChange} type="text" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <label className="col">Payback Date</label>
                        <input name="paybackDate" value={loanDetails.paybackDate} onChange={handleChange} type="date" className="col" aria-describedby="passwordHelpInline"/>
                    </div>
                </div>       
                <button type="submit" className="btn btn-primary" onClick={submitForm}>Generate Loan PDF</button>
            </form>  

            <div id="test" style={{display:"none"}}>
                <div> Borrower: {loanDetails.Name}</div>
                <div>Amount: {loanDetails.amount}</div>
                <div>Monthly Payment: {loanDetails.monthlyPayment}</div>
                <div>signature</div><div className="sigBox"></div>
            </div>
        </div>
    )
    
}


export default LoanAgreementCreate;

