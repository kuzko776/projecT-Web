import { Navigate } from "react-router";

export default function ProtectedRoute({ user, children, teacher }) {
  if (!user) {
     return <Navigate to="/login" replace />;
  }

  if (teacher?.verified === false){
    return <h1>Welcome Please Verify your account contact the admin.</h1>;
  }

  // if(user.uid != "eZwATTrW79V94exjNsML0R5k1Mc2"){
  //   return <Navigate to="/board_marks" replace />;
  // }

  return children;
}
