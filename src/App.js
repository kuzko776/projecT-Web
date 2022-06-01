import Routes from "./routes/index";
import { useState } from "react";
import ThemeConfig from "./theme";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SplashScreen from "pages/authentication/SplashScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });

  return (
    <ThemeConfig>
      {loading ? <SplashScreen /> : <Routes user={user} />}
    </ThemeConfig>
  );
}
