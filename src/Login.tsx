import React from "react";
import { useState } from "react";
import { useAuth } from "./hooks/AuthProvider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
    <>
      <Typography fontSize="3rem" variant="h1">
        Log in to find your new companion
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmitEvent}
        sx={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          type="email"
          name="email"
          label="email"
          placeholder="example@yahoo.com"
          onChange={handleInput}
          sx={{ m: 1 }}
        />
        <TextField
          sx={{ mb: 1 }}
          label="name"
          id="name"
          name="name"
          onChange={handleInput}
        />
        <Button type="submit" variant="outlined">
          Login
        </Button>
      </Box>
    </>
  );
};

export default Login;
