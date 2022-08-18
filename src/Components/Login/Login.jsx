import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


const Login = () => {
    const [showModal, setShowModal] = useState(true);
    const [inputs, setInputs] = useState({
      login: "",
      password: ""
    });


  const handleClose = () => setShowModal(false);

    
  const handleChange = (e) => {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value
      })
      }

  async function fetchUserId(e) {
        try {
          //create dev and production ENV variables for fetches
          //will probably need a local and dev key

          e.preventDefault();
          const response = await fetch(`https://localhost:7055/Auth?username=${inputs.login}&password=${inputs.password}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
      
          const result = await response.json();
          console.log("fetching result user id: ", result);

          //if result is valid, ill have to fix this eventually.
          let url = window.location.href;
          window.location = `${url}user-info/${result}`
          
          //redirect to UserInfo Page.

        } catch (err) {
          console.log(err);
        }
      }

    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Loan Buddy Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control name="login" value={inputs.login} onChange={handleChange} type="text" placeholder="Enter login" />                  
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" value={inputs.password} onChange={handleChange} type="password" placeholder="Password" />
                    </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={fetchUserId}>
                        Submit
                    </Button>
                </Modal.Footer>
        </Modal>
        </div>
    )
}

export default Login;