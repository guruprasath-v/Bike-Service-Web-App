import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [resp, setResp] = useState({});


    useEffect(() => {
        // Fetch bookings data when component mounts
        fetch(`${process.env.REACT_APP_BASE_URL_API}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.success == true){
                navigate('/users/me/');
            };
        })
    }, []);



    const submitApi = async (e) => {
        e.preventDefault();
        const userData = {
            userName:userName,
            userPassword:userPassword
        }
        setUserName('');
        setUserPassword('');
        fetch(`${process.env.REACT_APP_BASE_URL_API}/users/login`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(userData),
            credentials: 'include' 
        }).then (async mess => {
            const respoMess = await mess.json();
            setResp(respoMess);
            console.log(respoMess);
            if(respoMess.role === "Customer"){
                navigate('/users/me/');
            }else if(respoMess.role === 'Admin'){
                navigate('/users/admin/');
            }
            setTimeout(() => {
                setResp('');
            }, 4000);
        })
    }


    return (
        <div>
            <form onSubmit={submitApi}>
                <label htmlFor="userName">UserName</label>
                <input name="userName" type="text" placeholder="Enter your email" value={userName} required onChange={(e) => {
                    setUserName(e.target.value);
                }}/>
                <label htmlFor="userPassword">Password</label>
                <input name="userPassword" type="password" placeholder="Enter your password" value={userPassword} required onChange={(e) => {
                    setUserPassword(e.target.value);
                }}/>
                <button>Submit</button>
            </form>
            {resp && <div>{resp.message}</div>}
            {resp && <div>{resp.suggestedAction}</div>}


        </div>
    )
}