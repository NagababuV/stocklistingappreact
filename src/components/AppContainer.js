import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import NotFoundPage from "./NotFoundPage";
import HomePage from "./HomePage";
import SignUp from "./SignUp";
import SignIn from "./Login";
import UnauthorizedPage from "./UnauthorizedPage";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import Favorites from "./Favorites";
import Profile from "./Profile";  // Import the Profile component

function AppContainer() {
  const token = localStorage.getItem("token");
  console.log("app container:"+token);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        {/* <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/favorites" element={token ? <Favorites /> : <Navigate to="/signin" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/signin" />} /> */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/favorites" element={ <Favorites /> } />
        <Route path="/profile" element={ <Profile /> } />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default AppContainer;
