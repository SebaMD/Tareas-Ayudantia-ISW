import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Logout from '@pages/Logout';
import Home from '@pages/Home';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import '@styles/styles.css';
import Register from '@pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/logout',
        element: <Logout/>
      },
      {
        path: '/auth',
        element: <Login />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/register',
        element: <Register/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
