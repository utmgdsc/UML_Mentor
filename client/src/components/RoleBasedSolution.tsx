import React, { useEffect, useState } from 'react';
import Solution from '../pages/Solution.tsx';
import AdminSolution from '../pages/AdminSolution.tsx';

const RoleBasedSolution = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  //fetch the username from the server
  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{ username: string, role: string }>;
      })
      .then((data) => {
        console.log("Fetched username in role check: " + data.username + ", role: " + data.role);
        setIsAdmin(data.role === 'admin');
      })
      .catch((err: Error) => { // Add the error type 'Error'
        console.error("Failed fetching the username\nError message: " + err.message);
      });
  }, []);

  return isAdmin ? <AdminSolution /> : <Solution />;
};

export default RoleBasedSolution;
