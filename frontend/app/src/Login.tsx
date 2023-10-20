import React, { useState } from "react";

const Login: React.FC = () => {
  const [intraName, setIntra] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("intraID:", intraName);
    console.log("password:", password);
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intraName, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  return (
    <div className="login-form">
      <h1>Login</h1>
      <label>
        <span>Intra User Name: </span>
        <input
          id="intra"
          type="text"
          value={intraName}
          onChange={(e) => setIntra(e.target.value)}
        />
      </label>
      <label>
        <span>Password: </span>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        type="submit"
        onClick={(e) => {
          //e.preventDefault();
          handleLogin();
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
