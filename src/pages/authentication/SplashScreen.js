import { Grid } from "@mui/material";
import Lottie from 'react-lottie';
import animationData from '../../lottie/splash.json'

const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

export default function SplashScreen() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
        <Lottie options={defaultOptions}
              height={400}
              width={400}/>
    </Grid>
  );
}
