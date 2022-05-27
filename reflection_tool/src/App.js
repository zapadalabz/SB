import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

import { Route, Routes } from "react-router-dom";

import { useSearchParams } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/Navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Skills from "./components/Skills"
import SkillsI from "./components/SkillsI"
import ViewSkillsI from "./components/ViewSkillsI";
window.user = {fName:"", lName: "", role: "", email: "", OrgUnitId:""};
function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState({fName:"", lName: "", role: "", email: "", OrgUnitId:""});
  useEffect(() => {
    window.user = {
      fName: searchParams.get("firstName"),
      lName: searchParams.get("lastName"),
      role: searchParams.get("role"),
      email: searchParams.get("email"),
      OrgUnitId: searchParams.get("OrgUnitId")
  };
    setUser(window.user);
  }, []);
  
  return (
    <div>
    <Navbar role = {user.role}/>
    <Routes>
      {user.role ==="Instructor"?<Route exact path="/" element={<SkillsI/>} />:<Route exact path="/" element={<Skills/>} />}
      <Route path="/edit/:id" element={<Edit />} />
      <Route path="/view" element={<ViewSkillsI />} />
    </Routes>
  </div>
  );
}

export default App;
