import { useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandPage from "./pages/LandPage";
import EntradaMaterial from "./pages/EntradaMaterial";
import { AuthContextProvider } from "./store/AuthContext";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import LoaderDialog from "./components/ui/LoaderDialog";
import Materials from "./pages/Material/Materials";
import Stock from "./pages/Stock";
import Employees from "./pages/Employees";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    children: [
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <LandPage /> },
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
        ]
      },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/materials", element: <Materials /> },
          { path: "/stock", element: <Stock /> },
          { path: "/entradaMaterial", element: <EntradaMaterial /> },
          { path: "/employees", element: <Employees />},
        ],
      },
    ],
  },
]);

function App() {
  const loaderRef = useRef();

  return (
    <AuthContextProvider>
      <LoaderDialog ref={loaderRef} />
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
