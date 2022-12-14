import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import {
  BASE_URL,
  CHECK_EMAIL,
  CHECK_MOBILE,
  LOGIN,
} from "Constants/apiURLs.js";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "util/Firebase/FirebaseSetup.js";
import { getLocalStorage, setLocalStorage } from "util/Storage/Storage.js";
import styles from "./Login.style.js";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        ACME corporation
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const [open, setOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const navigate = useNavigate();
  const user = getLocalStorage("user");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      // const user = await signInWithEmailAndPassword(
      //   auth,
      //   data.get("email"),
      //   data.get("password")
      // );
      axios
        .post(`${BASE_URL}${LOGIN}`, {
          email: data.get("email"),
          password: data.get("password"),
        })
        .then((res) => {
          toast.success(`Logged-in Success!`, {
            theme: "dark",
          });
          const obj = {
            id: res.data.id,
            token: res.data.access,
            email: data.get("email"),
          };
          setLocalStorage("user", JSON.stringify(obj));
          navigate("/dashboard");
        });
    } catch (error) {
      let index = error.message.indexOf("/");
      toast.error(error.message.slice(index + 1, -2), {
        theme: "dark",
        position: "top-center",
      });
    }
  };

  const Gprovider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, Gprovider)
      .then((result) => {
        axios
          .post(`${BASE_URL}${CHECK_EMAIL}`, { email: result.user.email })
          .then((res) => {
            if (res.data.msg === "Email found") {
              setLocalStorage(
                "user",
                JSON.stringify({
                  id: res.data.id,
                  email: result.user.email,
                  token: "Authorized",
                })
              );
              toast.success(`loggedin success`, {
                theme: "dark",
              });
              navigate("/dashboard");
            } else {
              toast.error(`${res.data.msg}`, {
                theme: "dark",
              });
            }
          });
      })
      .catch((error) => {
        toast.error(error.message, {
          theme: "dark",
          position: "top-center",
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleForgotPasswordClose = () => {
    setResetPasswordOpen(false);
  };
  const otpRecieved = () => {
    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        axios
          .post(`${BASE_URL}${CHECK_MOBILE}`, { mobile: phoneNumber })
          .then((res) => {
            if (res.data.msg === "Mobile found") {
              setLocalStorage(
                "user",
                JSON.stringify({
                  id: res.data.id,
                  email: "mobile",
                  token: user.uid,
                })
              );
              toast.success(`loggedin success`, {
                theme: "dark",
              });
              navigate("/dashboard");
            } else {
              toast.error(`${res.data.msg}`, {
                theme: "dark",
              });
            }
          });
      })
      .catch((error) => {
        let index = error.message.indexOf("/");
        toast.error(error.message.slice(index + 1, -2), {
          theme: "dark",
          position: "top-center",
        });
      });
  };
  const signInWithOtp = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      auth
    );

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
        return confirmationResult;
      })
      .catch((error) => {
        let index = error.message.indexOf("/");
        toast.error(error.message.slice(index + 1, -2), {
          theme: "dark",
          position: "top-center",
        });
      });
  };
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent successfully!", {
          theme: "dark",
          position: "top-right",
        });
      })
      .catch((error) => {
        let index = error.message.indexOf("/");
        toast.error(error.message.slice(index + 1, -2), {
          theme: "dark",
          position: "top-right",
        });
      });
  };
  const otpFunction = () => {
    setSubmit(true);
    let res;
    if (submit) {
      otpRecieved(res);
      setOpen(false);
    } else {
      res = signInWithOtp();
    }
  };
  return user ? (
    <Navigate to="/dashboard" />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.outerBox}>
        <Avatar sx={styles.loginIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate mt={1}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" mt={3} mb={2}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Button
                variant="standard"
                onClick={() => {
                  setResetPasswordOpen(true);
                }}
              >
                Forgot password?
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Typography>OR</Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={() => signInWithGoogle()}
        >
          <GoogleIcon sx={{ mr: "10px" }} />
          Continue with Google
        </Button>
        <Typography>OR</Typography>
        <Button variant="contained" fullWidth onClick={() => setOpen(true)}>
          Sign-In with OTP
        </Button>
      </Box>
      <Copyright mt={8} mb={4} />
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Login with OTP</DialogTitle>
        <DialogContent>
          {!submit ? (
            <TextField
              autoFocus
              margin="dense"
              label="Mobile Number"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={phoneNumber}
              onChange={(e) => {
                if (
                  parseInt(e.target.value.slice(-1)) >= 0 &&
                  parseInt(e.target.value.slice(-1)) <= 9
                ) {
                  setPhoneNumber(e.target.value);
                }
              }}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="OTP"
              defaultValue={otp}
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => setOtp(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Box id="recaptcha-container"></Box>
          <Button onClick={() => otpFunction()}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog onClose={handleForgotPasswordClose} open={resetPasswordOpen}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            defaultValue=""
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleForgotPasswordClose();
              resetPassword();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
