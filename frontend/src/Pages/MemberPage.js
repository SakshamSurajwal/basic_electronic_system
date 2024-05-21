import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './mp.css';
import CardElem from '../Components/Card';
import MyProfile from '../Components/MyProfile';
import { Button, Input, useToast } from '@chakra-ui/react';
import { State } from '../Context/Provider';
import VoteCount from '../Components/VoteCount';

const MemberPage = () => {
  const history=useNavigate();
  const [candidate,setCandidate]=useState([]);
  const [electionDate,setElectionDate]=useState("");
  const {arr,setArr,obj,setObj}=State();
  const toast=useToast();

  const logoutHandler=()=>{
    localStorage.removeItem('userInfo');
    history("/");
  }

  function proper(str){
    if(str==="") return false;

    if(str.length!==10) return false;

    if('9'>=str[0]>='0'&&'9'>=str[1]>='0'&&'9'>=str[2]>='0'&&'9'>=str[3]>='0'&&'9'>=str[5]>='0'&&
    '9'>=str[6]>='0'&&'9'>=str[8]>='0'&&'9'>=str[9]>='0'&&str[4]==='-'&&str[7]==='-') return true;

    return false;
  }

  async function rajTilak(){
    if(!proper(electionDate)){
      toast({
        title: `Enter date with proper format`,
        duration: 5000,
        isClosable: true,
        position: "bottom"
    });

    return;
    }

    const con = {
      headers: {
          "Content-type": "application/json"
      }
  }

    await axios.post('/api/value',{value:electionDate},con);

    toast({
      title: `Election date successfully updated`,
      duration: 5000,
      isClosable: true,
      position: "bottom"
  });
  }

  async function func1(){
    const userInfo= JSON.parse(localStorage.getItem("userInfo"));

    const config={
        headers:{
            Authorization: `Bearer ${userInfo.token}`
        }
    }

    const {data}=await axios.get(`api/user/getCandidates`,config);

    setCandidate(data);
    var a=[];
    var o={};

    candidate.forEach(function myfunc(elem){
      if(!o[elem["post"]]){
      o[elem["post"]]=[];
      a.push(elem["post"]);
      }
    });

    setArr(a);

    candidate.forEach(function myfunc(elem){
    o[elem["post"]].push({post:elem["post"],name: elem["name"],voteCount: elem["voteCount"],aadharNum:elem["aadharNum"],userRole: 'member'});
  });

  
  setObj(o);
}

  useEffect(()=>{
    const userInfo= JSON.parse(localStorage.getItem("userInfo"));

    if(!userInfo){
        history("/");
    }
});

  useEffect(()=>{
    func1();
  },[candidate]);

  return (
    <div>
      <div style={{marginLeft:'15px',marginTop:'10px',marginBottom:'10px',display:'flex',justifyContent:'flex-end'}}>
        <div><MyProfile/></div>
        <div style={{marginLeft:'15px',marginRight:'15px'}}><Button onClick={logoutHandler}>Logout</Button></div>
      </div>
      <div style={{marginTop:'15px',color:'white',textAlign:'center'}}>As a member you can propose or seconder a candidate but only once</div>
      <div class='scroll'>
          {candidate?candidate.map((elem)=>{
            return <div style={{marginLeft:'30px',marginTop:'10px',marginBottom:'10px',marginRight:'30px',textAlign:'center',width:'300px'}}>
              <CardElem aadharNum={elem.aadharNum} name={elem.name} post={elem.post} isProposed={elem.isProposed} isSecondered={elem.isSecondered}/>
              </div>;
          }):<marquee>No candidate is nominated yet</marquee>}
      </div>
        <div style={{marginTop:'15px',color:'white',textAlign:'center'}}>Click on the post to watch the vote count of each secondered Candidate</div>
      <div class='scroll' style={{marginTop:'10px'}}>
          {arr?arr.map((elem)=>{
            return <div style={{marginLeft:'30px',marginTop:'10px',marginBottom:'10px',marginRight:'30px',textAlign:'center',width:'300px'}}>
              <VoteCount post={elem}/></div>
          }):<marquee>No candidate is secondered yet</marquee>}
      </div>
      <div style={{marginTop:'15px',color:'white'}}>Set Election date: </div>
      <div style={{marginTop:'15px',color:'black',textAlign:'center'}}>
        <Input style={{marginBottom:'12px'}} bg='white' placeholder='YYYY-MM-DD' onChange={(e) => {
                    setElectionDate(e.target.value);
                }}>
                </Input>
                <Button onClick={rajTilak}>Set</Button>
      </div>
    </div>
  )
}

export default MemberPage
