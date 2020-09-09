import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const Home = () => {
  Aos.init({ duration: 2000 });
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          //recordhasupdated? when we encounter the card with id in which we want to update the likes
          //we do map over it, and when we find it we return the updated card with updated likes rather
          //than the old one and finally set it.
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        //console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  const deleteComment = (postid, commentId) => {
    fetch(`/deletecomment/${postid}/${commentId}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      {data.length != 0 ? (
        <div className="home">
          {data.map((item, ind) => {
            return (
              <div
                className="custom-card"
                data-aos="zoom-out-up"
                data-aos-offset="-100"
                // data-aos-mirror="true"
                data-aos-duration="500"
                data-aos-once="true"
                data-aos-anchor-placement="top-center"
              >
                {/* AOS working fine with lesser width resize in inspect */}
                <div
                  style={{ borderRadius: "20px" }}
                  className="card home-card"
                  key={item._id}
                >
                  <h5
                    style={{
                      borderRadius: "50px",
                      display: "flex",
                      marginBottom: "0px",
                      width: "100%",
                    }}
                  >
                    <Link
                      to={
                        item.postedBy._id !== state._id
                          ? "/profile/" + item.postedBy._id
                          : "/profile"
                      }
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        style={{
                          margin: "5px",
                          height: "35px",
                          width: "35px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt="user-profile-pic"
                        src={item.postedBy.pic}
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {item.postedBy.name}
                      </span>
                    </Link>
                    {item.postedBy._id === state._id && (
                      <i
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                          cursor: "pointer",
                        }}
                        className="material-icons"
                        onClick={() => deletePost(item._id)}
                      >
                        delete
                      </i>
                    )}
                  </h5>
                  <div className="card-image">
                    <img alt="img" src={item.photo} />
                  </div>
                  <div className="card-content">
                    <div className="banner">
                      {item.likes.includes(state._id) ? (
                        <div
                          onClick={() => unlikePost(item._id)}
                          className="heart"
                          style={{
                            background: `url(${require("./video/heart.png")}) no-repeat`,
                            backgroundPosition: "-2800px 0",
                            transition: "background 1s steps(28)",
                          }}
                        ></div>
                      ) : (
                        <div
                          onClick={() => likePost(item._id)}
                          className="heart"
                          style={{
                            background: `url(${require("./video/heart.png")}) no-repeat`,
                          }}
                        ></div>
                      )}
                      <div>
                        <h6 style={{ marginLeft: "40px", marginTop: "-105px" }}>
                          {item.likes.length} likes{" "}
                        </h6>
                      </div>
                    </div>
                    <h6 style={{ fontWeight: "550" }}>{item.title} </h6>
                    <p style={{ position: "relative", left: "5px" }}>
                      {item.body}
                    </p>
                    {item.comments.map((record, index) => {
                      return (
                        <div key={record._id}>
                          {record.postedBy._id === state._id && (
                            <i
                              style={{ float: "right", cursor: "pointer" }}
                              className="material-icons"
                              onClick={() =>
                                deleteComment(item._id, record._id)
                              }
                            >
                              delete
                            </i>
                          )}
                          <h6
                            data-aos-once="true"
                            data-aos-offset="-1000"
                            data-aos="zoom-out"
                            data-aos-mirror="true"
                            data-aos-duration="500"
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                marginRight: "5px",
                                fontWeight: "400",
                                alignItems: "center",
                              }}
                            >
                              <img
                                style={{
                                  height: "20px",
                                  width: "20px",
                                  borderRadius: "50%",
                                  margin: "5px",
                                  objectFit: "cover",
                                }}
                                src={record.postedBy.pic}
                                alt="user-pic"
                              />
                              {record.postedBy.name}
                            </span>
                            {" " + record.text}
                          </h6>
                        </div>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        makeComment(e.target[0].value, item._id);
                        e.target[0].value = "";
                      }}
                    >
                      <input type="text" placeholder="add a comment" />
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ transitionDelay: "2s" }}>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              color: "black",
              zIndex: "1",
            }}
          >
            You are not following anyone !
          </span>
          <img
            style={{ width: "100vw", zIndex: "-1" }}
            src={require("./video/end.jpg")}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
