import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import Logo from "./video/fav.png";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [screenImage, setScreenImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const back1 =
    "https://res.cloudinary.com/gramcloud/video/upload/v1599935656/back2_xfg9k1.mp4";
  const back2 =
    "https://res.cloudinary.com/gramcloud/video/upload/v1599934787/check_syyi6q.mp4";
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "gram-clone");
    data.append("cloud_name", "gramcloud");
    fetch("https://api.cloudinary.com/v1_1/gramcloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: " Invalid email",
        classes: "#ef5350 red lighten-1",
      });
    }

    if (password1 !== password2) {
      return M.toast({
        html: " Password doesnt match",
        classes: "#ef5350 red lighten-1",
      });
    }
    setLoading(true);
    let password = password1;
    if (password.length < 5) {
      return M.toast({
        html: " Password Too short",
        classes: "#ef5350 red lighten-1",
      });
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
        } else {
          M.toast({ html: data.message, classes: "#66bb6a green lighten-1" });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div style={{ height: "100%" }}>
      {loading ? (
        <Loader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20vh",
          }}
          type="Rings"
          color="black"
          height="40vh"
          width="40vw"
          timeout={9000} //3 secs
        />
      ) : (
        <div style={{ height: "100%" }} className="mycard">
          <video
            autoPlay
            loop
            muted
            style={{
              opacity: "1",
              position: "absolute",
              width: "100%",
              height: "110%",
              objectFit: "cover",
            }}
          >
            <source
              src={Date.now() % 2 == 0 ? back1 : back2}
              type="video/mp4"
            />
          </video>
          <div className="card auth-card input-field">
            {/* <h2 className="sign-in-logo">Gram</h2> */}
            <h2>
              <img className="sign-logo" src={Logo} />
            </h2>
            <h6
              className="app-logo"
              style={{ marginTop: "-30px", fontFamily: "Grand Hotel, cursive" }}
            >
              PhotoGram
            </h6>
            <input
              style={{ textTransform: "capitalize" }}
              className="sign-input"
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <input
              className="sign-input"
              type="password"
              placeholder="Re-enter Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            <div className="file-field input-field signup-pic-show">
              <div className="btn mchangebtn">
                <span>Avatar</span>
                <input
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setScreenImage(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </div>
              {/* <div className="file-path-wrapper">
        <input
          className="sign-input"
          className="file-path validate"
          type="text"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div> */}
              <div>
                <img
                  style={{ objectFit: "cover" }}
                  className="signup-image"
                  alt=""
                  src={screenImage}
                />
              </div>
            </div>
            <button
              style={{ fontWeight: "bolder" }}
              className="btn waves-effect waves-light #757575 grey darken-1 signup-button"
              onClick={() => PostData()}
            >
              Signup
            </button>
            <h5>
              <Link to="/signin">
                <span style={{ color: "black" }}>
                  Already have an account ?
                </span>
              </Link>
            </h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
