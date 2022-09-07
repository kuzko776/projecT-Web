import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useState } from "react";

// @mui
import { styled } from "@mui/material/styles";
import { Card, Link, Container, Typography, Box } from "@mui/material";
// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Logo from "../../components/Logo";
// sections
import RegisterForm from "../../layout/RegisterForm";

import illustration_login from "images/login_animation.svg";

//firebase
import { getAuth, createUserWithEmailAndPassword, updateProfile  } from "firebase/auth";
import db from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
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
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const [toastError, setToastError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");

  const navigate = useNavigate();

  const showToast = (msg)=>{
    setToastError(true);
    setErrorMessage(msg);
  }

   //refrences
   const staffCollection = collection(db, "staff");

  const signup = (username,email, password, setSubmitting, setErrors) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setDoc(
          doc(staffCollection, userCredential.user.uid),
          {name: username, email: email, password: password, role:"teacher", verified:false}
        );
        updateProfile(auth.currentUser, {
          displayName: username
        })
        navigate("/community/dashboard", { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        switch (errorCode) {
          case "auth/invalid-email":
            setErrors({ email: "Your email address appears to be malformed." });
            break;

          case "auth/network-request-failed":
            showToast("Please make sure you have internet connection.")
            break;

          default:
            showToast("Something went worng, please try again later.");
        }

        setError(true);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Box>
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Already have an account? {""}
              <Link variant="subtitle2" component={RouterLink} to="/login">
                Login
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 11, mb: 5 }}>
              Manage your students more easily with Time T.
            </Typography>
            <img alt="register" src={illustration_login} />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Get started now.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              It's simple and easy.
            </Typography>

            <RegisterForm signup={signup}/>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: "text.secondary", mt: 3 }}
            >
              By registering, I agree to Time T&nbsp;
              <Link underline="always" color="text.primary" href="#">
                Terms of Service
              </Link>
              {""} and {""}
              <Link underline="always" color="text.primary" href="#">
                Privacy Policy
              </Link>
              .
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
                Already have an account?{" "}
                <Link variant="subtitle2" to="/login" component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Box>
  );
}
