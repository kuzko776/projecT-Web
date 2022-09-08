import Routes from "./routes/index";
import ThemeConfig from "./theme";

//firebase
import db from "../src/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
} from "firebase/firestore";

import SplashScreen from "pages/authentication/SplashScreen";
import { getDocument } from "helpers/DashboardHelper";
import { useEffect, useState } from "react";



export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null)

  const auth = getAuth();

  const staffCollection = auth.currentUser? doc(db, "staff", auth.currentUser.uid) : null;
  useEffect(() => getDocument(staffCollection, setTeacher), [user]);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });

  return (
    <ThemeConfig>
      {loading ? <SplashScreen /> : <Routes user={user} teacher={teacher} />}
    </ThemeConfig>
  );
}
