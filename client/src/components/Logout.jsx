import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL_API}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                navigate('/');
            } else {
                console.error("Failed to logout:", data.error);
            }
        })
        .catch(err => {
            console.error("Failed to logout:", err);
        });
    }, []);

    return null;
}