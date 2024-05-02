import React, { useState, useEffect } from "react";
import axios from "axios";

function InstitutionsTable() {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await axios.get("/api/institutions"); // Adjust the URL as needed
        setInstitutions(response.data);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      }
    };

    fetchInstitutions();
  }, []);

  return (
    <>
      {institutions.length !== 0 && (
        <div>
          <h1>Institutions and Accounts</h1>
          <table>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Accounts</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst) => (
                <tr key={inst._id}>
                  <td>{inst.name}</td>
                  <td>
                    {inst.accounts.map((acc) => (
                      <div key={acc._id}>
                        {acc.name} - Balance: ${acc.balances.current}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default InstitutionsTable;
