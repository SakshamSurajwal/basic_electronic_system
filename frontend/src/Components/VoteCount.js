import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { State } from '../Context/Provider';
import { Box,Button } from '@chakra-ui/react';
import axios from 'axios';

const VoteCount = (props) => {
  const [user,setUser]=useState({});
  const {obj,setObj}=State();
  const [cd,setCd]=useState(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef(null);
  const toast=useToast();

  useEffect(()=>{
    const userInfo= JSON.parse(localStorage.getItem("userInfo"));
                    setUser(userInfo);
  },[])

  return (
    <>
      <Button mt={4} onClick={onOpen}>
        {props.post}
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <div style={{textAlign:'center'}}>
        <ModalContent>
          <ModalHeader>{props.post}</ModalHeader>
          {
            obj[props.post].map((e)=>{
              return(
                <div style={{display:'flex',padding:'10px',backgroundColor:'green',color:'white'}}>
                  <div style={{marginRight:'5px'}}>Name: {e.name},</div>
                  <div>Vote Count: {e.voteCount}</div>
                  {(e.userRole==='voter')? <div style={{marginLeft:'auto'}}><Button onClick={async (even)=>{

                    even.preventDefault();

                    var x=new Date(props.ed);
                    var tomorrow = new Date(x);
                    tomorrow.setDate(x.getDate()+1);
                    
                    if(cd>=x&&cd<=tomorrow){
                     var x=sessionStorage.getItem(props.post);
                
                    if(x||user.hasVoted.includes(props.post)){
                      toast({
                        title: `You have already voted for ${props.post}`,
                        duration: 5000,
                        isClosable: true,
                        position: "bottom"
                    });
                    return;
                    }

                    const configuration={
                      headers:{
                          "Content-type":"application/json",
                          "Authorization": `Bearer ${user.token}`
                      }
                  }
                    await axios.put("/api/user/vote",{aadharNum:e.aadharNum},configuration);

                    toast({
                      title: `You vote has been recorded successfully for ${props.post}`,
                      duration: 5000,
                      isClosable: true,
                      position: "bottom"
                  });
                  sessionStorage.setItem(props.post,1);
                }
                else{
                  toast({
                    title: `Elections are not today`,
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
                }

                  }} colorScheme='red'>Vote</Button></div>:<div></div>}
                </div>
              )
            })
          }

          <ModalCloseButton />

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
        </div>
      </Modal>
    </>
  )
}

export default VoteCount
