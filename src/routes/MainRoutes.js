import { lazy } from "react";
import { Outlet } from "react-router";

import Loadable from "components/general/Loadable";
import MainLayout from "layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import MarksBoard from "pages/MarksBoard";
import MarksBoardTeacher from "pages/MarksBoardTeacher";
import AdminRoute from "./AdminRoute";

const Departments = Loadable(lazy(() => import("pages/Deptartments")));
const Batchs = Loadable(lazy(() => import("pages/Batchs")));
const Students = Loadable(lazy(() => import("pages/Students")));
const Staff = Loadable(lazy(() => import("pages/Staff")));
const Subjects = Loadable(lazy(() => import("pages/Subjects")));
const TimeTable = Loadable(lazy(() => import("pages/TimeTable")));
const Community = Loadable(lazy(() => import("pages/Community")));
const AllPosts = Loadable(lazy(() => import("pages/Community/AllPosts")));
const AllRequests = Loadable(lazy(() => import("pages/Community/AllRequests")));
const PostForm = Loadable(lazy(() => import("pages/Community/PostForm")));
const FullPost = Loadable(lazy(() => import("pages/Community/FullPost")));
const FullRequest = Loadable(lazy(() => import("pages/Community/FullRequest")));

// ==============================|| MAIN ROUTING ||============================== //

export default function MainRoutes(user) {
  return {
    path: "/",
    element: (
      <ProtectedRoute user={user}>
        <MainLayout user={user}/>
      </ProtectedRoute>
    ),

    children: [
      {
        path: "control_panel",
        element: (
          <AdminRoute user={user}>
            <Outlet />
          </AdminRoute>
        ),
        children: [
          {
            path: "departments",
            element: <Departments />,
          },
          {
            path: "time_table",
            element: <TimeTable />,
          },
          {
            path: "batchs",
            element: <Batchs />,
          },
          {
            path: "students",
            element: <Students />,
          },
          {
            path: "staff",
            element: <Staff />,
          },
          {
            path: "subjects",
            element: <Subjects />,
          },
        ],
      },
      {
        path: "board_marks",
        element: user?.uid ==="eZwATTrW79V94exjNsML0R5k1Mc2"? <MarksBoard /> : <MarksBoardTeacher />,
      },
      {
        path: "community",
        element: <Outlet />,
        children: [
          {
            path: "dashboard",
            element: (
              <AdminRoute user={user}>
                <Community />
              </AdminRoute>
            ),
          },
          {
            path: "posts",
            element: <AllPosts />,
          },
          {
            path: "requests",
            element: (
              <AdminRoute user={user}>
                <AllRequests />
              </AdminRoute>
            ),
          },
          {
            path: "post_form",
            element: <PostForm user={user} />,
          },
          {
            path: "posts/:postId",
            element: <FullPost />,
          },
          {
            path: "requests/:requestId",
            element: (
              <AdminRoute user={user}>
                <FullRequest />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  };
}
