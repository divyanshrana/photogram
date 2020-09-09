import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  ); // state is true for refresh bug

  console.log(userid);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        const newFollower = userProfile.user.followers.filter(
          //diff than main
          (item) => item !== data._id
        );
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                alt="profile pic"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                  objectFit: "cover",
                }}
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>
                  {userProfile.posts.length}
                  {" Posts"}
                </h6>
                <h6>
                  {userProfile.user.followers.length}
                  {" followers"}
                </h6>
                <h6>
                  {userProfile.user.following.length}
                  {" following"}
                </h6>
              </div>
              {!userProfile.user.followers.includes(state._id) ? (
                <button
                  style={{ margin: "20px" }}
                  onClick={() => {
                    followUser();
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "20px" }}
                  onClick={() => {
                    unfollowUser();
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  onClick={() => window.open(`${item.photo}`, "_blank")}
                  key={item._id}
                  alt={item.title}
                  className="item"
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>
          <Loader
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20vh",
            }}
            type="Puff"
            color="black"
            height="20vh"
            width="20vw"
            timeout={3000} //3 secs
          />
        </h2>
      )}
    </>
  );
};

export default Profile;
