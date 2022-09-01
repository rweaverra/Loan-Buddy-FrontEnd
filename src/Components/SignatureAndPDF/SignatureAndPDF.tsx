import React, {useState, useRef} from 'react';
import './SignatureAndPDF.css';
import jsPDF from "jspdf";
import SignaturePad from 'signature_pad';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import internal from 'stream';


interface Props {
    pdfUrl: string,
    otherParty: boolean,
    setThePdfUrl: (values: any) => void,
    loanIsSigned: () => void,
    saveAndEmailAgreement: () => void
  }

function SignatureAndPDF ({pdfUrl, otherParty, setThePdfUrl, loanIsSigned, saveAndEmailAgreement} : Props) {
  const [showSignPad, setShowSignPad] = useState<boolean>(false);
  const [showSaveAndEmailButton, setShowSaveAndEmailButton] = useState<boolean>(false); 
  const [showSignAgreementBtn, setShowSignAgreementBtn] = useState<boolean>(true);
  const canvasRef = useRef<any>(null);
 

    function signAgreement() {
        setShowSignPad(true);   
    }

   var sig = {} as any;
   var signatureUrl  = '' as string;
        ///SIGNATURE PAD
     if(canvasRef.current){
         //my ref is basically document.getElementById, but has to be done after element is rendered.
          sig = new SignaturePad(canvasRef.current);   
         canvasRef.current.width = 500;
         canvasRef.current.height = 200;
 
         sig.clear();
 
         console.log("canvasRef: ", canvasRef);
         console.log("sigPad: ", sig);
     }
     
 //adding this prevents me from using canvas immediately, but the sig is accurate.
     function resizeCanvas() {
         if(canvasRef.current) {
             const ratio =  Math.max(window.devicePixelRatio || 1, 1);
             canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
             canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
             canvasRef.current.getContext("2d").scale(ratio, ratio);
 
           if(sig && sig.clear) sig.clear();
         }
     }
     
     window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
 
     
 //moves to sig
     function clearSignature() {
         sig.clear();
     }
 
      //moves to sig
     function submitSignature() {
         signatureUrl = sig.toDataURL();
         sig.clear();
         addSignatureToPdf();
         setShowSignAgreementBtn(false);
     }
    //moves to sig
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
         
         //paste signature location based on creator or other party signature
         const height = otherParty ? 250 : 200
             
         firstPage.drawImage(pngImage, {
             x: 100,
             y: firstPage.getHeight() - height,
             width: pngDims.width,
             height: pngDims.height,
         });
         
         
         // Serialize the PDFDocument to base64 string      
         const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            //  setPdfUrl(pdfDataUri);
               setThePdfUrl(pdfDataUri);
             setShowSaveAndEmailButton(true);
             loanIsSigned();
       
   }

    return (
        <div>
           <div className='container'>
                 <iframe src={pdfUrl} />
                 <div className='row justify-content-center'>
                   <button className="btn btn-primary" 
                    style={{width: "45%", display: showSignAgreementBtn ? "inline-block" : "none"}} 
                   onClick={signAgreement}>Sign Agreement</button>
                 </div>                
                 { showSaveAndEmailButton &&<button className="btn btn-success" onClick={saveAndEmailAgreement}>Save and Email agreement to other party</button>}
            </div>
            <div className="signature-pad" style={{display: showSignPad ? "block" : "none"}}>
                <div className="signature-pad-body row justify-content-center">
                  <canvas ref={canvasRef}></canvas>
                </div>
                <div className="signature-pad-footer">
                    <div>sign Above</div>
                    <button className="btn" onClick={() => clearSignature()}>clear signature</button>
                    <button className="btn" onClick={()=> submitSignature()}>add signature</button>
                </div>             
            </div>
        </div>
      );
 }
  
  export default SignatureAndPDF;