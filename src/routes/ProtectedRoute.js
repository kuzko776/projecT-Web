import { Navigate } from "react-router";

export default function ProtectedRoute({ user, children }) {
  if (!user) {
     return <Navigate to="/login" replace />;
  }

  // if(user.uid != "eZwATTrW79V94exjNsML0R5k1Mc2"){
  //   return <Navigate to="/board_marks" replace />;
  // }

  return children;
}
