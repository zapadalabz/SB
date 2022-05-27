import React, { useState, useEffect } from "react";
import {} from "react-router";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";


//With email/classID, get users Skills from DB
//Display Current Reflection of Skills, allow user to edit and update(automatically?)

/*Format of DB response:
[{title: "Topic Title", K:["X","Y","Z"], A:["A","B","C"...], rateK:[#X,#Y,#Z...], rateK:[#A,#B,#C...], Comment:""},...]
*/
export default function SkillsList(props){
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const skills = props.skills;
    const email = props.email;
    const user = window.user;
    console.log(skills)

    const onSubmit = async data => {
        
        for(var i = 0;i < data.data.length;i++){
            skills[i] = {...skills[i],rating:data.data[i].rating};
        }
        //console.log(sample);

        await fetch(`http://localhost:5000/api/update`, {
            method: "POST",
            body: JSON.stringify({OrgUnitId: user.OrgUnitId, email: email, skills: skills}),
            headers: {
            'Content-Type': 'application/json'
            },
        }).catch(error => {
            window.alert(error);
            return;
          });
    }

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
        const [value, setAValue] = React.useState(props.rating);

        return(
            <div className = "skillCard">
                {skill} <input className={`slider ${"slider-" + value}`} {...register("data." + tIndex+".rating."+index)} type="range" min="0" max="3" value={value} step="1" onChange={({ target: { value } }) => setAValue(value)}/>
            </div>
        )
    }

    let topicList = Object.keys(skills).map((index)=>{
        return <TopicCard topic = {skills[index]} key = {index} tIndex = {index}/>
    });

    function setNewValues(){
        for(var i = 0; i < skills.length;i++){
            const topic = skills.title;
            for(var j=0;j<skills[i].skills.length;j++){
                //console.log(skills[i].skills[j]);
                setValue("data." + i+".rating."+j,skills[i].rating[j]);
            }
            
        }
    }
    setNewValues();
    return(
    <form onSubmit={handleSubmit(onSubmit)}>
        {topicList}
        {user.role ==="Learner"?<input type="submit" value="Update"/>:""}
</form>);
}