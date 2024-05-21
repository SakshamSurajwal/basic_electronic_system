import {FormControl,FormLabel, VStack,Input, InputGroup, InputRightElement,Button} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { State } from "../Context/Provider";

const Signup=()=>{
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [age,setAge]=useState();
    const [role,setRole]=useState("");
    const [aadharNum,setAadharNum]=useState();
    const [mobile,setMobile]=useState();
    const [address,setAddress]=useState("");
    const [show,setShow]=useState(false);
    const [show2,setShow2]=useState(false);
    const [loading,setLoading]=useState(false);
    const {cnt,setCnt}=State();
    const toast =useToast();
    const history=useNavigate();
    
    const submitHandler=async ()=>{
        setCnt(0);
        setLoading(true);
        if(!name||!email||!password||!confirmPassword||!aadharNum||!role||!address||!age){
            toast({
                title: "Please fill the required fields",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        if(role!=='member'&&role!=='voter'){
          toast({
            title: "You can only type member or voter in role",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setLoading(false);
        return;
        }
        if(role==='member'&&age<25){
          toast({
            title: "You should be atleast 25 years old to be a member",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setLoading(false);
        return;
        }
        if(role==='voter'&&age<18){
          toast({
            title: "You should be atleast 18 years old to be a voter",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setLoading(false);
        return;
        }
        try{
            const configuration={
                headers:{
                    "Content-type":"application/json"
                }
            };
            const {data}=await axios.post("/api/user",{
                    name:name,
                    email:email,
                    password:password,
                    aadharNum:aadharNum,
                    role: role,
                    address: address,
                    mobile: mobile,
                    age: age
            },configuration);

            toast({
                title: "Successfully signed up",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);

            if(role==='member') history("/member");
            else history("/voter");
        } 
        catch(err){
            toast({
                title: "Error",
                description:err.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel color='white'>Name</FormLabel>
                <Input bg='white' placeholder='Enter your name' onChange={(e)=>{
                        setName(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel color='white'>Email</FormLabel>
                <Input bg='white' placeholder='Enter email' onChange={(e)=>{
                        setEmail(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='age' isRequired>
                <FormLabel color='white'>Age</FormLabel>
                <Input bg='white' placeholder='Enter age' onChange={(e)=>{
                        setAge(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='aadharNum' isRequired>
                <FormLabel color='white'>Aadhar Number</FormLabel>
                <Input bg='white' placeholder='Enter aadhar no.' onChange={(e)=>{
                        setAadharNum(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='role' isRequired>
                <FormLabel color='white'>Role(member/voter)</FormLabel>
                <Input bg='white' placeholder='Enter Role' onChange={(e)=>{
                        setRole(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='mobile' isRequired>
                <FormLabel color='white'>Phone number</FormLabel>
                <Input bg='white' placeholder='Enter phone no.' onChange={(e)=>{
                        setMobile(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='address' isRequired>
                <FormLabel color='white'>Address</FormLabel>
                <Input bg='white' placeholder='Enter address' onChange={(e)=>{
                        setAddress(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel color='white'>Password</FormLabel>
                <InputGroup>
                    <Input type={show?"text":"password"} bg='white' placeholder='Enter the Password' onChange={(e)=>{
                        setPassword(e.target.value)
                    }}/>
                        <InputRightElement>
                            <Button h='1.75rem' marginRight='5px' onClick={()=> 
                            setShow(!show)}>
                                {show?"Hide":"Show"}
                            </Button>
                        </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel color='white'>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show2?"text":"password"} bg='white' placeholder='Confirm your Password' onChange={(e)=>{
                        setConfirmPassword(e.target.value)
                    }}/>
                        <InputRightElement>
                            <Button h='1.75rem' marginRight='5px' onClick={()=> 
                            setShow2(!show2)}>
                                {show2?"Hide":"Show"}
                            </Button>
                        </InputRightElement>
                </InputGroup>
            </FormControl><br/>
            <Button colorScheme='blue' onClick={submitHandler} width='100%' isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
}

export default Signup;