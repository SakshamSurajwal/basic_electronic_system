import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { State } from "../Context/Provider";

const Login = () => {
    const [aadharNum, setAadharNum] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { cnt, setCnt } = State();

    const toast = useToast();
    const history = useNavigate();

    const submitHandler = async () => {
        setCnt(0);
        setLoading(true);
        if (!aadharNum || !password) {
            toast({
                title: "Please fill the required fields",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        try {
            const configuration = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("/api/user/login",
                { aadharNum, password }, configuration);
            toast({
                title: "Login successfully",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);

            if (data.role === 'member') history("/member");
            else history("/voter");
        }
        catch (err) {
            toast({
                title: "Error",
                description: err.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='aadharNum' isRequired>
                <FormLabel color='white'>Aadhar Number</FormLabel>
                <Input bg='white' placeholder='Enter aadhar no.' onChange={(e) => {
                    setAadharNum(e.target.value);
                }}>
                </Input>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel color='white'>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} bg='white' placeholder='Enter the Password' onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                    <InputRightElement>
                        <Button h='1.75rem' marginRight='5px' onClick={() =>
                            setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl><br />
            <Button colorScheme='blue' onClick={submitHandler} width='100%' isLoading={loading}>
                Login
            </Button>
        </VStack>);
}

export default Login;