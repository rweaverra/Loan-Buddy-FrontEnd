import React from "react";
import { ITransaction } from "../../Utils/Utils";
import './Table.css';
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

type Props = {
    transactions: ITransaction[];
    headers: any;  //may be able to make this an ITransaction array type
  }

function Table({transactions, headers} : Props)  {
  return (
    <div className="table">
      <table className="table table-bordered table-hover">
        <TableHeader headers={headers} />
        <TableBody headers={headers} transactions={transactions} />
      </table>
    </div>
  );
};

export default Table;
