import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Signup from './pages/Signup';
import RootLayout from './pages/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    id:'root',
    children: [
      {index: true, element: <Signup />}, // Corrigir depois
    ]
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
