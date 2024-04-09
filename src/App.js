import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
    const [authState, setAuthState] = useState({ username: "", id: 0, status: false });

    useEffect(() => {
        axios.get("http://localhost:3001/auth/auth", { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
            if (response.data.error) {
                setAuthState({ ...authState, status: false });
            } else {
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });
            }
        });
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false });
    };

    return (
        <div className="App">
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <div className="navbar">
                        {!authState.status ? (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/registration">Register</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/">Home Page</Link>
                                <Link to="/createpost">Create A Post</Link>
                            </>
                        )}
                        <div className="loggedInContainer">
                            <h1><Link to={`/profile/${authState.id}`}>{authState.username}</Link></h1>
                            {authState.status && <Link to='/logout'><button onClick={logout}>Logout</button></Link>}
                        </div>
                    </div>
                    <Routes>
                        <Route path="/" exact Component={Home} />
                        <Route path="/createpost" exact Component={CreatePost} />
                        <Route path="/post/:id" exact Component={Post} />
                        <Route path="/registration" exact Component={Registration} />
                        <Route path="/login" exact Component={Login} />
                        <Route path="/logout" exact Component={Logout} />
                        <Route path="/profile/:id" exact Component={Profile} />
                        <Route path="/changepassword" exact Component={ChangePassword} />
                        <Route path="*" exact Component={PageNotFound} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
