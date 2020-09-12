import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: "Invalid email",
        classes: "#ef5350 red lighten-1",
      });
    }
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
        } else {
          M.toast({
            html: data.message,
            classes: "#66bb6a green lighten-1",
          });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Verify Email</h2>
        <input
          className="sign-input email"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          style={{ marginTop: "20px" }}
          onClick={() => {
            PostData();
          }}
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
        >
          Reset
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

export default Reset;
