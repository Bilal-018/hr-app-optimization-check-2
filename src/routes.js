import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/index";
import Dashboard from "./pages/Dashboard/Dashboard";
import { createBrowserRouter } from "react-router-dom";
import MyProfile from "./pages/profile/MyProfile";
import LeaveManagement from "./pages/profile/LeaveManagement";
import SkillManagement from "./pages/profile/SkillManagement";
import HrDashboard from "./pages/HrDashboard";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/ForgetPassword";
import Presentation from "./pages/Presentation";
import WithAll from "./components/WithAllHOC";
import Authentication from "./pages/Authentication";

const CustomLayout = ({ children }) => {
  return (
    <WithAll>
      <Layout>{children}</Layout>
    </WithAll>
  );
};

const routes = createBrowserRouter(
  [
    {
      element: <CustomLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/authentication",
          element: <Authentication />,
        },
        {
          path: "/forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "/my-profile",
          element: <MyProfile />,
        },
        {
          path: "/leave-management",
          element: <LeaveManagement />,
        },
        {
          path: "/skill-management",
          element: <SkillManagement />,
        },
        {
          path: "/hr-dashboard",
          element: <HrDashboard />,
        },
        {
          path: "/admin-settings",
          element: <AdminSettings />,
        },
        {
          path: "/presentations",
          element: <Presentation />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: "/",
  }
);

export default routes;
