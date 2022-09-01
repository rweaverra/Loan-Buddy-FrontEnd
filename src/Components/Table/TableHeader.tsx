import React from "react";
import './Table.css';

type Props = {
    headers: any;  //may be able to make this an ITransaction array type
  }


function TableHeader({headers} : Props) {
  return (
    <thead className="thead-dark" key="header-1">
      <tr key="header-0">
        {headers &&
          headers.map((value : string, index : number) => {
            return (
              <th key={index}>
                <div>{value}</div>
              </th>
            );
          })}
      </tr>
    </thead>
  );
};

export default TableHeader;
