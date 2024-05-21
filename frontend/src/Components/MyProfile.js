import React from 'react'
import { IconButton, useDisclosure,Button,Text } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const MyProfile = () => {
    const {onOpen,isOpen,onClose}=useDisclosure();
    const userInfo= JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div>
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display='flex' justifyContent="center" fontFamily="revert">{userInfo.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems='center'>
            <Text fontSize="20px"><p style={{color:'green'}}>Email:</p> {userInfo.email}</Text>
          </ModalBody>
          <ModalBody display="flex" alignItems='center'>
            <Text fontSize="20px"><p style={{color:'green'}}>Aadhar Number:</p> {userInfo.aadharNum}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default MyProfile
