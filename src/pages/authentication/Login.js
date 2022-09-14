import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";

// material
import { styled } from "@mui/material/styles";
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
// layouts
import AuthLayout from "layout/AuthLayout";
// components

import LoginForm from "layout/LoginForm";

import illustration_login from "images/login_animation.svg";
import illustration_login_error from "images/login_animation_error.svg";

//firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const [toastError, setToastError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const showToast = (msg) => {
    setToastError(true);
    setErrorMessage(msg);
  };

  const signin = (email, password, setSubmitting, setErrors) => {
    setError(false);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/control_panel/departments", { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        switch (errorCode) {
          case "auth/invalid-email":
            setErrors({ email: "Your email address appears to be malformed." });
            break;
          case "auth/wrong-password":
            setErrors({ password: "Wrong email/password combination." });

            break;
          case "auth/user-not-found":
            setErrors({ email: "No user found with this email." });

            break;

          case "auth/network-request-failed":
            showToast("Please make sure you have internet connection.");
            break;

          default:
            showToast("Something went worng, please try again later.");
        }

        setError(true);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <RootStyle>
      <AuthLayout />

      <SectionStyle sx={{ display: { xs: "none", md: "flex" } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 11, mb: 5 }}>
          Hi, Welcome Back
        </Typography>

        <a href="https://storyset.com/data">
          <img
            src={error ? illustration_login_error : illustration_login}
            alt="login"
          />
        </a>
      </SectionStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Sign in to Ribat
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Enter your details below.
            </Typography>
          </Stack>

          <LoginForm signin={signin} />

          <Typography variant="body2" sx={{ my: 2 }}>
            Don’t have an account? {""}
            <Link variant="subtitle2" component={RouterLink} to="/register">
              Get Started
            </Link>
          </Typography>

          <Snackbar
            open={toastError}
            autoHideDuration={6000}
            onClose={() => setToastError(false)}
          >
            <Alert
              onClose={() => setToastError(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
