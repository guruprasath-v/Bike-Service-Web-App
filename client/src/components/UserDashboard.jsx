export default function UserDashboard () {
    const clickHandler = () => {
        fetch("http://localhost:8080/users/me", {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        }).then(data =>{
            return data.json()
        }).then(jsondata => {
            console.log(jsondata)
        })
    }

    return(
        <button onClick={clickHandler}>Admin Click</button>
    )
}