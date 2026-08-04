import "./Login.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";


export function LoginPage() {

    const isLoggedIn = fetch("/api/validateSession")
    isLoggedIn.then((value) => {
        console.log(value)
        if (value.status == 200) {
            self
        }
    })

    async function login() {
        const navigate = useNavigate();
        const usernameInput = document.getElementById("usernameInput")
        const passwordInput = document.getElementById("passwordInput")
        const data = {
            "username": usernameInput.value,
            "password": passwordInput.value
        }
        const result = await axios.post(
            "/api/login",
            data
        )
        if (result.status == 200) {
            navigate("/dash")
        } else {
            document.getElementById("title").innerText = "Error"
            document.getElementById("title").style.color = "#FF383C"
        }
    }

    return (
        <main className="pageContainer">
            <div className="loginBox">
                <h1 id="title">Login</h1>
                <form>
                    <input id="usernameInput" type="username" placeholder="Username" />
                    <br />
                    <input id="passwordInput" type="password" placeholder="Password" />
                    <br />
                    <button className="submitButton" onClick={login}>Login</button>
                </form>
            </div>
        </main>
    )
}