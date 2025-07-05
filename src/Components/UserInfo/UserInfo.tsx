import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoanAgreementOutline from '../LoanAgreementOutline/LoanAgreementOutline';
import { ILoanAgreement, IUserInfo } from '../../Utils/Utils';
import { fetchData } from '../../Utils/AjaxRequests';

function UserInfo() {
  const [userData, setUserData] = useState<IUserInfo>({});
  const [loanAgreements, setLoanAgreements] = useState<ILoanAgreement[]>([]);
  const params = useParams();
  const userId = params.userId as string;

  async function getdata() {
    await fetchData("GET", `https://localhost:7055/LoanAgreementsGet/${userId}`)
      .then(data => {
        setUserData(data.data.userInfo);
        setLoanAgreements(data.data.loanAgreements);
      });
  }

  useEffect(() => {
    getdata();
    // eslint-disable-next-line
  }, []);

  if (loanAgreements.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">{userData?.name ? `${userData.name}'s Loans` : "User's Loans"}</h2>
            {userData?.email && <p className="text-muted mb-0">{userData.email}</p>}
          </div>
          <Link to={`/loan-agreement-create/${userId}`}>
            <button className="btn btn-warning">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Loan Agreement
            </button>
          </Link>
        </div>
        <hr />
        <div className="row">
          {loanAgreements.map((loan, i) => (
            <div className="col-md-6 col-lg-4 mb-4" key={i}>
              <LoanAgreementOutline loanAgreement={loan} userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;