import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  InputAdornment,
  Divider,
  Tab,
  Tabs,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

function Login() {
  const [tab, setTab] = useState("Login");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupCheckPassword, setSignupCheckPassword] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useSession();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!isValidEmail(signupEmail)) {
      setError(true);
      setErrorMessage("Invalid email.");
    } else if (signupPassword !== signupCheckPassword) {
      setError(true);
      setErrorMessage("Passwords do not match.");
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/user/signup`,
          {
            email: signupEmail,
            password: signupPassword,
          }
        );
        if (response.status === 201) {
          login(response.data);
          navigate("/profile");
        }
      } catch (error) {
        setError(true);
        setErrorMessage(error.response.data.error);
        console.error(error.message);
      }
    }
  };

  const handleLogin = async () => {
    if (!isValidEmail(loginEmail)) {
      setError(true);
      setErrorMessage("Invalid email.");
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/user/login`,
          {
            email: loginEmail,
            password: loginPassword,
          }
        );
        if (response.status === 200) {
          login(response.data);
          navigate("/");
        }
      } catch (error) {
        setError(true);
        setErrorMessage(error.response.data.error);
        console.error(error.message);
      }
    }
  };

  const handleGoogleLogin = async (response) => {
    const token = response.credential;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/user/google`,
        {
          token,
        }
      );

      if (response.status === 200) {
        login(response.data);
        navigate("/");
      } else if (response.status === 201) {
        login(response.data);
        navigate("/profile");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.error);
      console.error(error.message);
    }
  };

  const handleTabChange = (e, newValue) => {
    setError(false);
    setErrorMessage("");
    setTab(newValue);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Container
      maxWidth={false}
      sx={{
        paddingTop: "5%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        width={"20%"}
        height={"55%"}
        sx={{
          paddingTop: "1em",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "2em" }}
        >
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Login" value={"Login"} />
            <Tab label="Signup" value={"Signup"} />
          </Tabs>
        </Box>
        {tab === "Login" && (
          <Box>
            <Typography variant="h2" sx={{ marginBottom: "1em" }}>
              Sign In
            </Typography>
            <TextField
              variant="standard"
              fullWidth
              value={loginEmail}
              onChange={(e) => {
                setLoginEmail(e.target.value);
              }}
            ></TextField>
            <InputAdornment position="start">email</InputAdornment>
            <TextField
              variant="standard"
              fullWidth
              value={loginPassword}
              type="password"
              onChange={(e) => {
                setLoginPassword(e.target.value);
              }}
            ></TextField>
            <InputAdornment position="start">password</InputAdornment>
            <Button
              sx={{ margin: "1em" }}
              onClick={handleLogin}
              variant="contained"
            >
              Login
            </Button>
          </Box>
        )}
        {tab === "Signup" && (
          <Box>
            <Typography variant="h2" sx={{ marginBottom: "1em" }}>
              Create an Account
            </Typography>
            <TextField
              variant="standard"
              fullWidth
              value={signupEmail}
              onChange={(e) => {
                setSignupEmail(e.target.value);
              }}
            ></TextField>
            <InputAdornment position="start">email</InputAdornment>
            <TextField
              variant="standard"
              fullWidth
              value={signupPassword}
              type="password"
              onChange={(e) => {
                setSignupPassword(e.target.value);
              }}
            ></TextField>
            <InputAdornment position="start">password</InputAdornment>
            <TextField
              variant="standard"
              fullWidth
              value={signupCheckPassword}
              type="password"
              onChange={(e) => {
                setSignupCheckPassword(e.target.value);
              }}
            ></TextField>
            <InputAdornment position="start">confirm password</InputAdornment>
            <Button
              sx={{ margin: "1em" }}
              onClick={handleSignup}
              variant="contained"
            >
              Sign up
            </Button>
          </Box>
        )}
        {error && (
          <Typography variant="body1" color="#FF0000">
            {errorMessage}
          </Typography>
        )}
      </Box>
      <Divider width={"45%"} sx={{ marginY: "2em" }}></Divider>

      <GoogleLogin onSuccess={handleGoogleLogin}></GoogleLogin>
    </Container>
  );
}

export default Login;
