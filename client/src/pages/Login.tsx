import "./Login.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export function LoginPage(props) {
    const credentials = {
        username: "",
        password: ""
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        credentials[name] = value;
    }

    async function login(e) {
        e.preventDefault()
        const result = await fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        })
        if (result.status == 200) {
            if (props.onLoggedIn) {
                props.onLoggedIn()
            }
        } else {
            document.getElementById("title").innerText = "Error"
            document.getElementById("title").style.color = "#FF383C"
        }
    }

    return (
        <div className="pageContainer">
            <div className="loginBox">
                <h1 id="title">Login</h1>
                <form onSubmit={login}>
                    <input type="username" name="username" placeholder="Username" onChange={handleChange} />
                    <br />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                    <br />
                    <input type="submit" className="submitButton" value="Login" />
                </form>
            </div>
        </div>
    )
}