import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const CreatePost = () => {
  Aos.init({ duration: 2000 });
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"), //in this ""?
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
          } else {
            M.toast({
              html: "Post Uploaded",
              classes: "#66bb6a green lighten-1",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    if (!image) {
      return M.toast({
        html: "Choose a photo!",
        classes: "#66bb6a red lighten-1",
      });
    }
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div data-aos="fade-down" data-aos-duration="600" className="fullbody">
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
          timeout={3000} //3 secs
        />
      ) : (
        <div
          className="card input-field"
          style={{
            margin: "40px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div className="create-post-text">Create a Post</div>
          <input
            className="create-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="create-input"
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
          />
          <div className="file-field input-field">
            <div className="btn">
              <span>Select</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={() => postDetails()}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
