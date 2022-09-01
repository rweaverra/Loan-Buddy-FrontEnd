import React from "react";
import { ITransaction } from "../../Utils/Utils";


type Props = {
    transactions: ITransaction[];
    headers: any;  //may be able to make this an ITransaction array type
  }

  
function TableBody({transactions, headers} : Props) {
  const columns = headers ? headers.length : 0;
  const showSpinner = transactions === null;

  function buildRow(transaction : any, headers : any) {
    return (
      <tr key={transaction.transactionId}>
        {headers.map((value : any, index : number) => {
          return <td key={index}>{transaction[value]}</td>;
        })}
      </tr>
    );
  }

  return (
    <tbody>
      {showSpinner && (
        <tr key="spinner-0">
          <td colSpan={columns} className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </td>
        </tr>
      )}
      {!showSpinner &&
        transactions &&
        transactions.map(value => {
          return buildRow(value, headers);
        })}
    </tbody>
  );
};

export default TableBody;
