import {createContext,useContext,useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

const Context= createContext();

const CntProvider=({children})=>{
    const [cnt,setCnt]=useState(0);
    const [arr,setArr]=useState([]);
    const [obj,setObj]=useState({});
    const history=useNavigate();
    
    useEffect(()=>{
        const userInfo= JSON.parse(localStorage.getItem("userInfo"));

        if(!userInfo){
            history("/");
        }
    },[history]);
    
    return <Context.Provider value={{cnt,setCnt,arr,setArr,obj,setObj}}>{children}</Context.Provider>
}

export const State=()=>{
    return useContext(Context);
}

export default CntProvider;