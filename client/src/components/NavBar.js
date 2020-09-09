import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { reducer } from "../reducers/userReducer";
import M from "materialize-css";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems, {});
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="login-pic">
          <img
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
              float: "right",
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
  return (
    <span>
      <nav>
        <div class="nav-wrapper">
          <Link
            to={state ? "/" : "signin"}
            style={{ marginLeft: "30px" }}
            className="brand-logo"
          >
            Gram
          </Link>
          <a href="#" data-target="mobile-demo" class="sidenav-trigger">
            <i class="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </span>
  );
};

export default NavBar;
