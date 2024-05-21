import React, { useEffect } from 'react'
import { Card, CardHeader, CardBody, Heading,Stack,StackDivider,Box, Button } from '@chakra-ui/react'
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { State } from '../Context/Provider';

const CardElem = (props) => {
    const [p,setP]=useState("Propose");
    const [s,setS]=useState("Seconder");
    const {cnt,setCnt}=State();
    const toast=useToast();

    async function func3(){
        if(props.isProposed) setP("Proposed");
        if(props.isSecondered) setS("Secondered");
    }

    useEffect(()=>{
        func3();
    },[props.isProposed,props.isSecondered])

    async function func1(e){
      e.preventDefault();
      const userInfo=JSON.parse(localStorage.getItem("userInfo"));
      console.log(cnt);

        if(userInfo.hasProposed===true||userInfo.hasSecondered===true||cnt>0){
          toast({
            title: "You have already proposed or secondered someone",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        return;
        }

        if(p==="Proposed"){
            toast({
                title: "Candidate is already proposed",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        const configuration={
            headers:{
                "Content-type":"application/json",
                "Authorization": `Bearer ${userInfo.token}`
            }
        }

        setCnt(1);
        await axios.put("api/candidate/propose",{aadharNum: props.aadharNum},configuration);

        toast({
            title: "Proposed successfully",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
    }

    async function func2(e){
        e.preventDefault();

        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
      console.log(cnt);

        if(userInfo.hasProposed===true||userInfo.hasSecondered===true||cnt>0){
          toast({
            title: "You have already proposed or secondered someone",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        return;
        }

        if(p==="Propose"){
            toast({
                title: "Candidate can only be secondered if he or she is proposed",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if(s==="Secondered"){
            toast({
                title: "Candidate is already secondered",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        const configuration={
          headers:{
              "Content-type":"application/json",
              "Authorization": `Bearer ${userInfo.token}`
          }
      }

      setCnt(1);
      await axios.put("api/candidate/seconder",{aadharNum: props.aadharNum},configuration);

      toast({
          title: "Secondered successfully",
          duration: 5000,
          isClosable: true,
          position: "bottom"
      });
    }

  return (
    <Card style={{backgroundColor:'whitesmoke',color:'purple'}}>
  <CardHeader>
    <Heading size='md'>{props.name}</Heading>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          {props.post}
        </Heading>
      </Box>
      <Box>
        <Button onClick={func1} colorScheme='orange'>{p}</Button>
      </Box>
      <Box>
        <Button onClick={func2} colorScheme='yellow'>{s}</Button>
      </Box>
    </Stack>
  </CardBody>
</Card>
  )
}

export default CardElem
