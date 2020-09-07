import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { reducer } from "../reducers/userReducer";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
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
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
            className="btn waves-effect waves-light #e53935 red darken-1"
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
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "signin"} className="brand-logo left">
          Gram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
