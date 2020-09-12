import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
import Back1 from "./video/back1.mp4";
import Back2 from "./video/back2.mp4";

const Newpassword = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { token } = useParams();
  console.log(token);

  //   useEffect(() => {
  //     console.log(state);
  //     if (state !== null) {
  //       localStorage.clear();
  //       dispatch({ type: "CLEAR" });
  //       M.toast({
  //         html: "Signing out!",
  //         classes: "#ef5350 red lighten-1",
  //       });
  //     }
  //   });

  const PostData = () => {
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
        <h2>Reset password for {email}</h2>

        <input
          className="sign-input"
          type="password"
          placeholder="enter a new password"
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
          Update
        </button>
        <br />
      </div>
    </div>
  );
};

export default Newpassword;
