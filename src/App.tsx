import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./hooks/AuthProvider";
import Login from "./Login";
import Dogs from "./Dogs";
import PrivateRoute from "./PrivateRoute";
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/dogs" element={<Dogs />} />
            </Route>
            <Route path="/" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
