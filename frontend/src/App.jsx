import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './pages/Root';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandPage from './pages/LandPage';
import EntradaMaterial from './pages/EntradaMaterial';
import { AuthContextProvider } from './store/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    id:'root',
    children: [
      {index: true, element: <LandPage />},
      {path: '/login', element: <Login />},
      {path: '/dashboard', element: <Dashboard />},
      {path: '/signup', element: <Signup />},
      {path: '/entradaMaterial', element: <EntradaMaterial />}
    ]
  }
]);

function App() {

  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}

export default App
