import {useState} from "react";
import Clicker from "../components/UserDashboard";

export default function Login(){
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [resp, setResp] = useState({});

    const submitApi = async (e) => {
        e.preventDefault();
        const userData = {
            userName:userName,
            userPassword:userPassword
        }
        setUserName('');
        setUserPassword('');
        fetch("http://localhost:8080/users/login", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(userData),
            credentials: 'include' 
        }).then (async mess => {
            const respoMess = await mess.json();
            setResp(respoMess);
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
                <input name="userPassword" type="password" placeholder="Enter your email" value={userPassword} required onChange={(e) => {
                    setUserPassword(e.target.value);
                }}/>
                <button>Submit</button>
            </form>
            {resp && <div>{resp.message}</div>}
            {resp && <div>{resp.suggestedAction}</div>}

            <Clicker />

        </div>
    )
}