import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { reducer } from "../reducers/userReducer";
import M from "materialize-css";
import { MDBInput, MDBCol } from "mdbreact";

const NavBar = () => {
  const searchModal = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  const SearchPage = () => {
    return (
      <div className="search-use">
        <MDBCol md="6">
          <MDBInput
            style={{ width: "100%" }}
            data-target="modal1"
            className="modal-trigger search-user"
            onChange={(e) => fetchUsers(e.target.value)}
            hint="  Search users"
            type="text"
            containerClass="mt-0"
          />
        </MDBCol>
      </div>
    );
  };

  useEffect(() => {
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems, {});
    // var elems1 = document.querySelectorAll(".modal"); //can be done using useRef hook also
    // M.Modal.init(elems1, {});
    M.Modal.init(searchModal.current);
  }, []);

  // useEffect(() => {
  //   // add when mounted
  //   document.addEventListener("mousedown", handleClick);
  //   // return function to be called when unmounted
  //   return () => {
  //     document.removeEventListener("mousedown", handleClick);
  //   };
  // }, []);
  // const handleClick = (e) => {
  //   if (searchModal.current.contains(e.target)) {
  //     // inside click
  //     return;
  //   }
  //   // outside click
  //   setSearch("");
  // };
  const renderList = () => {
    if (state) {
      return [
        <li style={{ marginRight: "40px" }} key="search-user">
          {/* <i
            style={{ display: "none" }}
            data-target="modal1"
            className="small material-icons modal-trigger"
          >
            search
          </i> */}

          {/* <div
            style={{ position: "absolute", zIndex: "1", left: "20vw" }}
            className="input-field col s6 sidesearch"
          > */}
          {/* <i className="material-icons prefix">account_circle</i> */}
          {/* <input
              data-target="modal2"
              id="icon_prefix"
              type="text"
              className="validate"
              value={search}
              onChange={(e) => fetchUsers(e)}
            />
            <label for="icon_prefix">Search users</label> */}
          {/* {search ? (
              
            ) : (
              ""
            )} */}
          {/* <ul style={{ border: "0px" }} className="collection">
            {userDetails.map((item) => {
              return (
                <li className="collection-item avatar">
                  <img src={item.pic} alt="" className="circle" />
                  <span className="title">{item.name}</span>
                  <p>
                    {item.followers.length}{" "}
                    <span style={{ fontSize: "small" }}> {" followers"}</span>
                    <br />
                    <span style={{ color: "grey", fontSize: "smaller" }}>
                      {item.email}
                    </span>
                  </p>
                  <a
                    style={{ borderRadius: "50px" }}
                    href={"/profile/" + item._id}
                    className="secondary-content"
                    onClick={() => setSearch("")}
                  >
                    <i className="material-icons ">open_in_browser</i>
                  </a>
                </li>
              );
            })}
          </ul> */}
          {/* </div> */}
        </li>,
        <li>
          {" "}
          <SearchPage />
        </li>,
        <li>
          {" "}
          <i
            data-target="modal1"
            onChange={(e) => fetchUsers(e.target.value)}
            className="material-icons modal-trigger search-butt"
          >
            search
          </i>
        </li>,
        <li key="login-pic">
          <img
            className="profile-pic"
            src={state.pic}
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              height: "50px",
              width: "50px",
              marginTop: "7px",
              border: "1px solid grey",
              marginLeft: "10%",
              marginRight: "5px",
            }}
          />
        </li>,
        <li key="profile">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="create">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="myfollowingpost">
          <Link to="/myfollowingpost">My Followings</Link>
        </li>,
        <li key="reset-password">
          <Link to="/reset">
            <span className="forgot" style={{}}>
              Forgot Password?
            </span>
            <br />
          </Link>
        </li>,
        <li key="logout">
          <button
            style={{ marginRight: "10px" }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
            className="btn waves-effect waves-light #e53935 red darken-1 logout"
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="signin">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="signup">
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  };
  const fetchUsers = (query) => {
    //let query = e.target.value;
    setSearch(query);
    if (query === "") {
      query = "@#!@$#@$#@$^#^"; //random so it doesnt find anything
    }
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        //console.log(results);
        setUserDetails(results.user);
      });
  };
  return (
    <span>
      <nav>
        <div className="nav-wrapper">
          <Link to={state ? "/" : "signin"} className="brand-logo">
            PhotoGram
          </Link>
          <a data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>

        <div id="modal1" className="modal" ref={searchModal}>
          <div className="modal-content">
            <a
              onClick={() => {
                fetchUsers("!@@#&!@$#!@$"); //random string so it doesnt matches with any
                setSearch("");
              }}
              className="btn-floating btn-small waves-effect waves-light red clr"
            >
              <i className="material-icons">remove</i>
            </a>
            <input
              className="name-cust"
              type="text"
              placeholder="Search Users..."
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />{" "}
            <ul style={{ border: "0px" }} className="collection">
              {userDetails.map((item) => {
                return (
                  <li className="collection-item avatar">
                    <img
                      style={{
                        marginLeft: "-10px",
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      src={item.pic}
                      alt=""
                      className="circle"
                    />
                    <span className="title">{item.name}</span>
                    <p>
                      {item.followers.length}{" "}
                      <span style={{ fontSize: "small" }}> {" followers"}</span>
                      <br />
                      <span style={{ color: "grey", fontSize: "smaller" }}>
                        {item.email}
                      </span>
                    </p>
                    <Link
                      style={{ borderRadius: "50px" }}
                      to={
                        item && item._id !== state._id
                          ? "/profile/" + item._id
                          : "/profile"
                      }
                      className="secondary-content"
                      onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch("");
                      }}
                    >
                      <i className="material-icons">open_in_browser</i>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </span>
  );
};

export default NavBar;
