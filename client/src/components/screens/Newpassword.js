import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const Newpassword = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
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
    if (password1 !== password2) {
      return M.toast({
        html: " Password does not match!",
        classes: "#ef5350 red lighten-1",
      });
    }
    let password = password1;
    if (password.length < 5) {
      return M.toast({
        html: " Password Too short !",
        classes: "#ef5350 red lighten-1",
      });
    }
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
    <div className="mycard fullbody">
      <div className="card auth-card input-field">
        <h2>Reset password{email}</h2>

        <input
          className="sign-input"
          type="password"
          placeholder="enter a new password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <input
          className="sign-input"
          type="password"
          placeholder="re-enter new password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
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
