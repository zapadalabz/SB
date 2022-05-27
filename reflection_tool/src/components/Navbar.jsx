import React from "react";
 
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Navbar(props) {
  const role = props.role;
  console.log(role);
 return (
   <div>
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
       <button
         className="navbar-toggler"
         type="button"
         data-toggle="collapse"
         data-target="#navbarSupportedContent"
         aria-controls="navbarSupportedContent"
         aria-expanded="false"
         aria-label="Toggle navigation"
       >
         <span className="navbar-toggler-icon"></span>
       </button>
 
       <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav ml-auto">
           <li className="nav-item">
             
             <NavLink className="nav-link" to="/view">
                {role==="Instructor"?"View Skills":"Skills"}
             </NavLink>
             
           </li>
         </ul>
       </div>
     </nav>
   </div>
 );
}