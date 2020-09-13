import React, {
  useEffect,
  createContext,
  useReducer,
  useContext,
  useState,
} from "react";
import NavBar from "./components/NavBar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/SignIn";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribesUserPosts from "./components/screens/SubscribesUserPosts";
import Reset from "./components/screens/Reset";
import Newpassword from "./components/screens/Newpassword";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext(); //??

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  console.log("Proxy removed, And also not using CORS");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      //history.push("/");
    } else {
      if (!history.location.pathname.startsWith("/reset")) {
        history.push("/signin");
      }
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribesUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <Newpassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [bgcolor, setbgColor] = useState("#99b898");
  const [color, setColor] = useState("black");
  const [dark, setDark] = useState("false");

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {dark ? (
        <a
          onClick={() => {
            setDark(!dark);
          }}
          className="btn-floating btn-large waves-effect waves-light red dark"
        >
          <i
            style={{
              transform: "rotate(20deg)",
              backgroundColor: "#1d2d50",
            }}
            className="material-icons"
          >
            brightness_2
          </i>
        </a>
      ) : (
        <a
          onClick={() => {
            setDark(!dark);
          }}
          className="btn-floating btn-large waves-effect waves-light red dark"
        >
          <i
            style={{
              transform: "rotate(20deg)",
              backgroundColor: "#cf1b1b",
            }}
            className="material-icons"
          >
            brightness_4
          </i>
        </a>
      )}

      <div
        style={{
          backgroundColor: dark ? bgcolor : "#1B262C",
          color: dark ? color : "white",
        }}
      >
        <BrowserRouter>
          <NavBar />
          <Routing />
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
