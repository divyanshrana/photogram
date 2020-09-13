import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import Logo from "./video/fav.png";

import { UserContext } from "../../App";
const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const back1 =
    "https://res.cloudinary.com/gramcloud/video/upload/v1599935656/back2_xfg9k1.mp4";
  const back2 =
    "https://res.cloudinary.com/gramcloud/video/upload/v1599934787/check_syyi6q.mp4";

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
    <div className="mycard fullbody">
      <video
        autoPlay
        loop
        muted
        style={{
          color: "blue",
          opacity: "0.9",
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={Date.now() % 2 === 0 ? back1 : back2} type="video/mp4" />
      </video>
      <div className="card auth-card input-field">
        {/* <h2 className="sign-in-logo">Gram</h2> */}
        <h2>
          <img className="sign-logo" src={Logo} />
        </h2>
        <h6 className="app-logo" style={{ marginTop: "-30px" }}>
          PhotoGram
        </h6>
        <input
          className="sign-input email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="sign-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={{ marginTop: "20px", fontWeight: "bolder" }}
          onClick={() => {
            PostData();
          }}
          className="btn waves-effect waves-light #9e9e9e grey"
        >
          Login
        </button>
        <br />

        <h5>
          <Link to="/signup">
            <span style={{ marginTop: "10px", color: "black" }}>
              Dont have an account ?
            </span>
          </Link>
        </h5>
        <Link to="/reset">
          <span style={{ position: "relative", top: "10px", color: "black" }}>
            Forgot Password?
          </span>
          <br />
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
