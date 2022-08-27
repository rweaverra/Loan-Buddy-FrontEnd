import React, {useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import getAllUserData from '../../Utils/AjaxRequests';
import { IUserInfo, ILoanAgreement} from '../../Utils/Utils';
import './LoanAgreementCreate.css';
import SignaturePad from 'signature_pad';
import PDFDocument from 'pdf-lib';

 type TypeOfLoan = "borrow" | "lend" | "";

function LoanAgreementCreate() {
  const [userInfo, setUserInfo] = useState<IUserInfo>({});
  const [typeOfLoan, setTypeOfLoan] = useState<TypeOfLoan>("");
  const [loanDetails, setLoanDetails] = useState<ILoanAgreement>({});
  const [otherPartyInfo, setOtherPartyInfo] = useState<IUserInfo>({}); 
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [showSignPad, setShowSignPad] = useState<boolean>(false);
  const [showSaveAndEmailButton, setShowSaveAndEmailButton] = useState<boolean>(false);
  const myRef = useRef(null);

  const params = useParams();
  const userId = params.userId || "";  //as string
  
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

  function buildPDF() {
    const doc = new window.jsPDF();
    doc.fromHTML(document.getElementById("pdf"));

    var pdf = doc.output('bloburl');
    setPdfUrl(pdf);
  }

  function signAgreement() {
    setShowSignPad(true);
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
    console.log("SubmitNewLoanAgreementResult: ", result);
  }


    ///SIGNATURE PAD
    var sig : any = {};
    var signatureUrl = '';
    if(myRef.current){
        //my ref is basically document.getElementById, but has to be done after element is rendered.
        sig = new SignaturePad(myRef.current);
        sig.clear();
    }

    function clearSignature() {
        sig.clear();
    }

    function submitSignature() {
        signatureUrl = sig.toDataURL();
        sig.clear();
        addSignatureToPdf();
    }

    async function addSignatureToPdf() {

        // Fetch existing PDF document
        const url = pdfUrl;
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        
        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
        // Get the first page of the document
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        
        // Fetch signature image url
        const pngUrl = signatureUrl;
        const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
            
        const pngImage = await pdfDoc.embedPng(pngImageBytes);
        const pngDims = pngImage.scale(0.25);
            
        firstPage.drawImage(pngImage, {
            x: 100,
            y: firstPage.getHeight() - 200,
            width: pngDims.width,
            height: pngDims.height,
        });
        
        
        // Serialize the PDFDocument to base64 string      
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            setPdfUrl(pdfDataUri);
            setShowSaveAndEmailButton(true);

        let signedBy = typeOfLoan === "borrow" ?  "SignedByBorrower" : "SignedByLender";

        setLoanDetails({
            ...loanDetails,
            [signedBy]: true,
            requiresSignatures: true
        })
  }

    function saveAndEmailAgreement() {
        submitFinishedLoanAgreement();               
    }

    if(!userInfo) return <div>loading...</div>

    return (
        <div className="container">
            {pdfUrl && <div>
                <iframe src={pdfUrl} />
                    <button className="btn btn-primary" onClick={signAgreement}>Sign Agreement</button>
                 { showSaveAndEmailButton &&<button className="btn btn-primary" onClick={saveAndEmailAgreement}>Save and Email agreement to other party</button>}
                </div>}
            <div style={{ display: showSignPad ? "block" : "none" }}>
               <canvas ref={myRef} style={{ display: showSignPad ? "block" : "none" }} width="400" height="200"></canvas>
               <button onClick={() => clearSignature()}>clear signature</button>
               <button onClick={()=> submitSignature()}>add signature</button>
            </div>
            <h4>Create Loan Agreement</h4>
            <div>{userInfo.name}</div>
            <br></br>
            <span>
            <button className="btn btn-success" onClick={() => setLoanType("borrow")}>Borrow Money</button>
            <button className="btn btn-success" onClick={() => setLoanType("lend")}>Lend Money</button>
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

