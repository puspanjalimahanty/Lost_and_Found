// src/pages/ReportedItems.jsx
import React from "react";
import "./ReportedItems.css";

const sampleReports = [
  { id: 1, item: "Wallet", reporter: "Alice", description: "Black leather wallet found in library." },
  { id: 2, item: "Backpack", reporter: "Bob", description: "Blue bag with books found near canteen." },
];

const ReportedItems = () => {
  return (
    <div className="reported-items-container">
      <h2>Reported Items</h2>
      <ul className="report-list">
        {sampleReports.map((report) => (
          <li key={report.id}>
            <h3>{report.item}</h3>
            <p><strong>Reporter:</strong> {report.reporter}</p>
            <p>{report.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportedItems;
