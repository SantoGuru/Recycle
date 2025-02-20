import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Signup from './pages/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Signup />
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
