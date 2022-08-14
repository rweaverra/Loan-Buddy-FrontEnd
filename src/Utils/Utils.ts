export interface ILoanAgreement  {
    "loanAgreementId": number,    
    "lenderId": number,
    "borrowerId": number,
    "originalAmount": number,
    "dateCreated": string,
    "monthlyPaymentAmount": number, 
    "remainingTotal": number 
  }

  // export async function getLoanAgreementData(any: loanId) {
  //   try {
  //     const response = await fetch("https://localhost:7055/api/Values/GetLoanAgreements", {
  //       method: 'GET',
  //       headers: {
  //         accept: 'application/json',
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Error! status: ${response.status}`);
  //     }
  
  //     const result = await response.json();
  //     console.log("fetching result: ", result);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }