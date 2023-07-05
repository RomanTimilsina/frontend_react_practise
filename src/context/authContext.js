import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";

export const AuthContext = createContext();



export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

 const updateUser =  (data) => {
  console.log(currentUser)
  setCurrentUser(data)
 }
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

