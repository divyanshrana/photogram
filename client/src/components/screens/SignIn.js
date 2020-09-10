import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
import Back1 from "./video/back1.mp4";
import Back2 from "./video/back2.mp4";

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: " invalid email",
        classes: "#ef5350 red lighten-1",
      });
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "signin successful",
            classes: "#66bb6a green lighten-1",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <video
        autoPlay
        loop
        muted
        style={{
          color: "blue",
          opacity: "0.9",
          position: "absolute",
          width: "100%",
          height: "90.5%",
          objectFit: "cover",
          zIndex: "-1",
        }}
      >
        <source
          src={Math.floor(Math.random() * 10) % 2 == 1 ? Back1 : Back2}
          type="video/mp4"
        />
      </video>
      <div className="card auth-card input-field">
        <h2>Gram</h2>
        <input
          className="sign-input email"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="sign-input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={{ marginTop: "20px" }}
          onClick={() => {
            PostData();
          }}
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
        >
          Login
        </button>
        <h5>
          <Link to="/signup">
            <span style={{ marginTop: "10px", color: "black" }}>
              Dont have an account ?
            </span>
          </Link>
        </h5>
      </div>
    </div>
  );
};

export default SignIn;
