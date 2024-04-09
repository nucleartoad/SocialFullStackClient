import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/');
    }, []);

    return (
        <></>
    );
};

export default Logout;