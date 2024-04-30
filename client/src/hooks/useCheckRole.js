import { useState, useEffect } from "react";

const useCheckRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => response.json())
      .then((data) => {
        setIsAdmin(data.role === "admin");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user role:", error);
        setIsLoading(false);
      });
  }, []);

  return { isAdmin, isLoading };
};

export default useCheckRole;
