import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './mp.css';
import MyProfile from '../Components/MyProfile';
import { Button, Input, useSafeLayoutEffect, useToast } from '@chakra-ui/react';
import { State } from '../Context/Provider';
import VoteCount from '../Components/VoteCount';
import PDFContent from '../Components/PDFContent';

const VoterPage = () => {
  const history=useNavigate();
  const [candidate,setCandidate]=useState([]);
  const {arr,setArr,obj,setObj}=State();
  const [post,setPost]=useState("");
  const [ed,setEd]=useState("");
  const toast=useToast();

  const getPdf=()=>{
    PDFContent({arr,obj});
  }

  const logoutHandler=()=>{
    localStorage.removeItem('userInfo');
    history("/");
  }

  async function wit(){
    const userInfo= JSON.parse(localStorage.getItem("userInfo"));

  try{
    await axios.delete("/api/candidate/withdrawl",{data:{aadharNum:userInfo.aadharNum}});

    toast({
      title: `You have successfully withdrawled`,
      duration: 5000,
      isClosable: true,
      position: "bottom"
  });
  }
  catch(err){
    toast({
      title: `You are not nominated so you cannot withdrawl`,
      duration: 5000,
      isClosable: true,
      position: "bottom"
  });
  }

  }

  async function nom(){
    if(post===""){
      toast({
        title: "Please mention the post for which you want to get nominated",
        duration: 5000,
        isClosable: true,
        position: "bottom"
    });
    return;
    }

    const userInfo= JSON.parse(localStorage.getItem("userInfo"));

    const configuration={
      headers:{
          "Content-type":"application/json",
          "Authorization": `Bearer ${userInfo.token}`
      }
  }
  try{
    await axios.post("/api/candidate/nominate",{post,aadharNum:userInfo.aadharNum},configuration);

    toast({
      title: `You are nominated for ${post}`,
      duration: 5000,
      isClosable: true,
      position: "bottom"
  });
  }
  catch(err){
    toast({
      title: `You are already nominated`,
      duration: 5000,
      isClosable: true,
      position: "bottom"
  });
  }

  }

  async function func2(){
    const {data}= await axios.get('/api/value');
    setEd(data.value);
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
      if(elem.isSecondered===true){
    o[elem["post"]].push({post:elem["post"],name: elem["name"],voteCount: elem["voteCount"],aadharNum:elem["aadharNum"],userRole: 'voter'});
      }
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
    func2();
  },[candidate]);

  return (
    <div>
      <div style={{marginLeft:'15px',marginTop:'10px',marginBottom:'10px',display:'flex',justifyContent:'flex-end'}}>
        <div><MyProfile/></div>
        <div style={{marginLeft:'15px',marginRight:'15px'}}><Button onClick={logoutHandler}>Logout</Button></div>
      </div>
        <div style={{marginTop:'15px',color:'white',textAlign:'center'}}>Click on the post to watch the vote count of each secondered Candidate</div>
      <div class='scroll' style={{marginTop:'10px'}}>
          {arr?arr.map((elem)=>{
            return <div style={{marginLeft:'30px',marginTop:'10px',marginBottom:'10px',marginRight:'30px',textAlign:'center',width:'300px'}}>
              <VoteCount ed={ed} post={elem}/></div>
          }):<marquee>No candidate is secondered yet</marquee>}
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{marginTop:'40px',backgroundColor:'orange'}}>
        <Input style={{marginBottom:'10px',backgroundColor:'lightgreen'}} bg='white' placeholder='Enter post' onChange={(e) => {
                    setPost(e.target.value);
                }}>
                </Input>
          <Button onClick={nom} colorScheme='red'>Nominate Yourself
          </Button></div>
        <div style={{marginTop:'15px',backgroundColor:'orange'}}><Button onClick={wit} colorScheme='red'>Withdrawl Your Nomination</Button></div>
        <div style={{marginTop:'15px',backgroundColor:'orange'}}><Button onClick={getPdf} colorScheme='red'>Get Results</Button></div>
      </div>
      {ed? <marquee style={{color:'white'}}>Election is on {ed}</marquee> :<marquee style={{color:'white'}}>Election date is not yet announced</marquee>}
    </div>
  )
}

export default VoterPage
