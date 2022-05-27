import React, { useState, useEffect } from "react";
import {} from "react-router";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import SkillsList from "./SkillsList";
import '../inputSlider.css';

export default function ViewSkillsI(){
    const [studentData, setStudentData] = useState([]);
    const [emails,setEmails] = useState([]);
    const [currentView, setCurrentView] = useState(0);
    const user = window.user;
    
    useEffect(() => {
        async function getStudentData() {
            const response = await fetch(`/api/${user.OrgUnitId}`);
        
            if (!response.ok) {
              const message = `An error occurred: ${response.statusText}`;
              window.alert(message);
              return;
            }
        
            const data = await response.json();
            var temp = [];
            for(var i = 0; i < data.length;i++){
                if(data[i].hasOwnProperty("email")){
                    temp.push(data[i]);
                }
            }
            //setEmails(temp);
            setStudentData(temp);
            //console.log(temp);
          }
        
          getStudentData();
    }, []);

    function EmailOption(props){

        return(
            <option value = {props.index}>{props.email}</option>
        )
    }
    let emailList = Object.keys(studentData).map((index)=>{
        return <EmailOption email = {studentData[index].email} key = {index} index = {index}/>
    });

    function handleSelectOnChange(selected){
        setCurrentView(selected);
    }

    return(
        <div>
            <select id="selectEmail" value = {currentView} onChange={e => handleSelectOnChange(e.target.value)}>
                {emailList}
            </select>
            <div className="skillViewer d-flex flex-column justify-content-center align-items-center">
                {studentData.length>0?<SkillsList skills = {studentData[currentView].Skills} email = {studentData[currentView].email}/>:""}
            </div>
        </div>
    )
}