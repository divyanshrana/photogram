import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({ ...state, pic: data.url })
          // );
          // dispatch({ type: "UPDATEPIC", payload: data.url });
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ pic: data.url }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div className="profile-image">
          <img
            alt="profile pic"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              objectFit: "cover",
            }}
            src={state ? state.pic : "loading"}
          />
          <span>
            <input
              type="file"
              name="file"
              id="fileupload"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
            <label htmlFor="fileupload">Update</label>
          </span>
        </div>
        <div>
          <h4>{state ? state.name : "loading..."}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics.length} Posts</h6>
            <h6>{state ? state.followers.length : "0"} Followers</h6>
            <h6>{state ? state.following.length : "0"} Following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              alt={item.title}
              className="item"
              src={item.photo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
