
export default  async function getAllUserData(userId : string | undefined) {
    try {
      const response = await fetch(`https://localhost:7055/LoanAgreementsGet/${userId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result.data;
      //now that I have service response I need to update this because it wont be sending errors
    } catch (err) {
      console.log(err);
    }
  }