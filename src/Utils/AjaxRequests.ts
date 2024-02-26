export async function fetchData(method : string, url : string, body? : any) {
    const response = await fetch(`${url}`, {
      method: method,
      headers:{
        'Content-Type': 'application/json',
        Authorization: getAuth()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      if(response.status == 401 || response.status == 403) {       
      let url = window.location.origin;
        window.location.href = `${url}`;
      }
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();    
    return result;
}

export async function postFile(method : string, url : string, formData : FormData) {
  const response = await fetch(`${url}`, {
    method: method,
    headers:{
    //'Content-Type': 'multipart/form-data', // dont need, the browser will create this.
      Authorization: getAuth()
    },
    body: formData
  });

  if (!response.ok) {
    if(response.status == 401 || response.status == 403) {       
    let url = window.location.origin;
      window.location.href = `${url}`;
    }
    throw new Error(`Error! status: ${response.status}`);
  }

  const result = await response.json();    
  return result;
}

  function getAuth() {
    if(localStorage.token){
      return `Bearer ${localStorage.token.toString()}`
    } else {
      return "";
    }
  }