import { react, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword () {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const changePassword = () => {
        axios.put(
            "http://localhost:3001/auth/changepassword",
            {currentPassword: currentPassword, newPassword: newPassword},
            { headers: { accessToken: localStorage.getItem("accessToken")
        }}).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                alert(response.data);
                navigate("/");
            }
        });
    }

    return (
        <>
            <h1>Change Your Password</h1>
            <input type="text" placeholder="Current Password" onChange={(event) => {
                setCurrentPassword(event.target.value);
            }}/>
            <input type="text" placeholder="New Password" onChange={(event) => {
                setNewPassword(event.target.value);
            }}/>
            <button onClick={() => changePassword()}>Submit Changes</button>
        </>
    )
}

export default ChangePassword;