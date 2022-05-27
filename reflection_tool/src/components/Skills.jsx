import React, { useState, useEffect } from "react";
import {} from "react-router";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import SkillsList from "./SkillsList";


//With email/classID, get users Skills from DB
//Display Current Reflection of Skills, allow user to edit and update(automatically?)

/*Format of DB response:
[{title: "Topic Title", K:["X","Y","Z"], A:["A","B","C"...], rateK:[#X,#Y,#Z...], rateK:[#A,#B,#C...], Comment:""},...]
*/
export default function Skills(){
    let sample = [{title:"Topic 1",skills:["Hydrogen","Helium","Lithium"],rating:["2","3","1"]},
                {title:"Topic 2",skills:["Group 1","Group 2","Group 3"],rating:["2","3","1"]}];

    const [searchParams, setSearchParams] = useSearchParams();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async data => {
        
        for(var i = 0;i < data.data.length;i++){
            skills[i] = {...skills[i],rating:data.data[i].rating};
        }
        //console.log(sample);

        await fetch(`/api/update`, {
            method: "POST",
            body: JSON.stringify({OrgUnitId: user.OrgUnitId, email: user.email, skills: skills}),
            headers: {
            'Content-Type': 'application/json'
            },
        }).catch(error => {
            window.alert(error);
            return;
          });
    }
    
    const [user, setUser] = useState({fName:"", lName: "", role: "", email: "", OrgUnitId:""});

    const [skills, setSkills] = useState([]);

    useEffect(() => {
        setUser({...user, 
            fName: searchParams.get("firstName"),
            lName: searchParams.get("lastName"),
            role: searchParams.get("role"),
            email: searchParams.get("email"),
            OrgUnitId: searchParams.get("OrgUnitId")
        });
        async function getSkillsTemplate() {
            const response = await fetch(`/api/skillsTemplate/${searchParams.get("OrgUnitId")}`);
        
            if (!response.ok) {
              const message = `An error occurred: ${response.statusText}`;
              window.alert(message);
              return;
            }
        
            const skills = await response.json();
            return skills.Skills;
          }
        
          getSkillsTemplate().then(async (templateSkills)=>{
              const response = await fetch(`/api/skills/${searchParams.get("OrgUnitId")}/${searchParams.get("email")}`);
              //const response = await fetch(`http://localhost:5000/api/skills/${searchParams.get("OrgUnitId")}/a@b.com`);
              if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
              }
          
              const userSkills = await response.json();
              if (userSkills !== null){
                if(templateSkills.length > userSkills.Skills.length){
                    setSkills(templateSkills);
                  }else{
                    setSkills(userSkills.Skills);
                  }
              }else{
                setSkills(templateSkills);
              }
              
          });
    }, []);
    


    function TopicCard(props){
        //console.log(props.topic);
        const topic = props.topic.title;
        const skill = props.topic.skills;
        const rating = props.topic.rating;

        let skillList = Object.keys(skill).map((index)=>{
            return <SkillCard skill = {skill[index]} rating = {rating[index]} key = {index} index = {index} topic ={topic} tIndex={props.tIndex}/>
        });

        return(
            <div>
                Topic: {topic}
                {skillList}
            </div>
        )
    }

    function SkillCard(props){
        const index = props.index;
        const skill = props.skill;
        const topic = props.topic;
        const tIndex = props.tIndex;
        return(
            <div>
                {skill} <input {...register("data." + tIndex+".rating."+index)} type="range" min="0" max="3" defaultValue={props.rating} step="1"/>
            </div>
        )
    }

    let topicList = Object.keys(skills).map((index)=>{
        return <TopicCard topic = {skills[index]} key = {index} tIndex = {index}/>
    });

    return(
    <div>
        <h1>{user.fName} {user.lName} has the role {user.role}</h1>
        <div className="skillViewer d-flex flex-column justify-content-center align-items-center">
            {skills.length>0?<SkillsList skills = {skills} email = {user.email}/>:""}
        </div>
    </div>);
}