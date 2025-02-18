import React from "react";
import { useState } from "react";
import { useAuth } from "./hooks/AuthProvider";
const Login = () => {
  const [input, setInput] = useState({ email: "", name: "" });
  const auth = useAuth();

  const handleSubmitEvent = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    if (input.email !== "" && input.name !== "") {
      auth.login(input);
      return;
    }
    alert("please provide a valid input");
  };

  const handleInput = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <form onSubmit={handleSubmitEvent}>
      <div className="form_control">
        <label htmlFor="user-email">Email:</label>
        <input
          type="email"
          id="user-email"
          name="email"
          placeholder="example@yahoo.com"
          aria-describedby="user-email"
          aria-invalid="false"
          onChange={handleInput}
        />
      </div>
      <div className="form_control">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          aria-describedby="user-name"
          aria-invalid="false"
          onChange={handleInput}
        />
      </div>
      <button className="btn-submit">Submit</button>
    </form>
  );
};

export default Login;
