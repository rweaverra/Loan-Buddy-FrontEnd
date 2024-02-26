import React, {useState} from 'react';
import { fetchData } from '../../Utils/AjaxRequests';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

interface User {
  login: string;
  password: string;
};

function Login() {
    const [showModal, setShowModal] = useState<boolean>(true);
    const [inputs, setInputs] = useState<User>({
      login: "",
      password: ""
    });

  const handleClose = () => setShowModal(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value
      })
  }

  async function fetchUserId() {
    await fetchData("GET", `https://localhost:7055/Auth?username=${inputs.login}&password=${inputs.password}`)
    .then(data => {
      localStorage.setItem('token', data.token);
      let url = window.location.href;
      window.location.href = `${url}user-info/${data.user.userId.toString()}`
    });
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