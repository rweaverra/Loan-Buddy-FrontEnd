import { userInfo } from 'os';
import React, {useState, useEffect, useRef} from 'react';
import { Link, useParams } from 'react-router-dom';
import getAllUserData from '../../Utils/AjaxRequests';
import { IUserInfo} from '../../Utils/Utils';
import './LoanAgreementCreate.css';
import jsPDF from "jspdf";
import SignaturePad from 'signature_pad';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';


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
      var sig = {};
      var signatureUrl = '';
      if(myRef.current){
        console.log("myRef: ", myRef);
        //my ref is basically document.getElementById, but has to be done after element is rendered.
       sig = new SignaturePad(myRef.current);
       sig.clear();
        // setSignaturePad(new SignaturePad(myRef.current))

       }

       function clearSignature() {
        sig.clear();
       }
       function submitSignature() {
        // const data = sig.toDataURL("image/jpeg");
        signatureUrl = sig.toDataURL();
        sig.clear();
        console.log("sig data: ", signatureUrl);
        modifyPdf();

         //add the dependencies
        //get the pdf URL
        //get the signature PNG file
        //add the signature to the pdf
        //save/show the pdf again.
       }
    
      //END SIGNATURE PADS

      async function modifyPdf() {
 
        // Fetch an existing PDF document
        const url = pdfUrl;
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
      
        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      
        // Get the first page of the document
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        
        // Fetch JPEG image
        const jpgUrl = signatureUrl;
        const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
          
        const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
        const jpgDims = jpgImage.scale(0.25);
        
      
        // Get the width and height of the first page
        const { width, height } = firstPage.getSize();
          firstPage.drawText('This text was added with JavaScript!', {
             x: 5,
             y: height / 2 + 300,
             size: 50,
             color: rgb(0.95, 0.1, 0.1),
             rotate: degrees(-45),
           });
      
        
              // Add a blank page to the document
      
      
       firstPage.drawImage(jpgImage, {
          x: firstPage.getWidth() / 2 - jpgDims.width / 2,
          y: firstPage.getHeight() / 2 - jpgDims.height / 2,
          width: jpgDims.width,
          height: jpgDims.height,
        });
        
        
        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        console.log("PDFBYTES SAVED: ", pdfBytes);
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    //   document.getElementById('pdf').src = pdfDataUri;
      setPdfUrl(pdfDataUri);
              // Trigger the browser to download the PDF document
        // download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");

      
      }

    if(!userInfo) return <div>loading...</div>

    return (
        <div className="container">

            {pdfUrl && <div>
                <iframe src={pdfUrl} />
                <button className="btn btn-primary" onClick={signAgreement}>Sign Agreement</button>
                </div>}
            <div style={{ display: showSignPad ? "block" : "none" }}>
               <canvas ref={myRef} style={{ display: showSignPad ? "block" : "none" }} width="400" height="200"></canvas>
               <button onClick={() => clearSignature()}>clear signature</button>
               <button onClick={()=> submitSignature()}>submit signature</button>
            </div>
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

