import React, { useState, useEffect } from "react";
import {} from "react-router";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function SkillsI(){
    //const OrgUnitId = props.OrgUnitId;
    const [file, setFile] = useState();
    const [array, setArray] = useState([]);
    const user = window.user;

    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = async string => {
        //const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(0).split("\r\n");
        let tempArray = []
        for (var i = 2; i < csvRows.length-1;i+=2){
            //console.log("Topic: ", csvRows[i].split(",").filter(Boolean));
            //console.log("K: ", csvRows[i+1].split(",").filter(Boolean));
            //console.log("A: ", csvRows[i+2].split(",").filter(Boolean));
            tempArray.push({
                title: csvRows[i].split(",").filter(Boolean)[0],
                skills: csvRows[i+1].split("\t").filter(Boolean),
                rating: Array(csvRows[i+1].split("\t").filter(Boolean).length).fill(0)
            });
        }
                
        
        setArray(tempArray);
        //console.log(tempArray);
        await fetch(`http://localhost:5000/api/updateSkillsTemplate`, {
            method: "POST",
            body: JSON.stringify({OrgUnitId: user.OrgUnitId, skills: tempArray}),
            headers: {
            'Content-Type': 'application/json'
            },
        }).catch(error => {
            window.alert(error);
            return;
          });
      };

    const handleOnSubmit = (e) => {
        e.preventDefault();
    
        if (file) {
          fileReader.onload = function (event) {
            const text = event.target.result;
            csvFileToArray(text);
          };
    
          fileReader.readAsText(file);
        }
      };

      const headerKeys = Object.keys(Object.assign({}, ...array));

    return(
        <div>
            <h1>Instructor Skills Page</h1>
            <div style={{ textAlign: "center" }}>
                <form>
                    <input
                        type={"file"}
                        id={"txtFileInput"}
                        accept={".txt"}
                        onChange={handleOnChange}
                    />
                    <button onClick={(e) => {handleOnSubmit(e);}}>
                        Upload Skills
                    </button>
                </form>
                <br />

      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
            </div> 
        </div>
    )
}