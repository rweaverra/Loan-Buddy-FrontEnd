import React from "react";
import { ITransaction } from "../../Utils/Utils";

type Props = {
  transactions: ITransaction[];
};

const headers = [
  { key: "amount", label: "Amount" },
  { key: "transactionType", label: "Type" },
  { key: "date", label: "Date" },
  { key: "remainingTotal", label: "Remaining Total" }
] as const;

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Format date as dd-mm-yyyy
const formatDate = (dateValue: string | Date) => {
  const dateObj = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (isNaN(dateObj.getTime())) return ""; // Invalid date
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

const Table: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="table-responsive rounded shadow-sm my-4">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="text-uppercase text-secondary fw-bold small"
                scope="col"
                style={{ background: "#f8f9fa" }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center text-muted py-4">
                <div>
                  <i className="bi bi-info-circle" style={{ fontSize: "1.5rem" }}></i>
                  <div>No transactions found.</div>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((transaction, idx) => (
              <tr key={transaction.transactionId ?? idx}>
                {headers.map((header) => (
                  <td key={header.key}>
                    {header.key === "amount" || header.key === "remainingTotal"
                      ? formatCurrency(Number(transaction[header.key]))
                      : header.key === "date"
                        ? formatDate(transaction[header.key] as string | Date)
                        : String(transaction[header.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;