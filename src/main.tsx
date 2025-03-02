import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import './index.css';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import LibrarianDashboard from './pages/Librarian/LibrarianDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DocumentSearch from './pages/Client/DocumentSearch';
import AccountInfo from './pages/Client/AccountInfo';

// Root component that includes the AuthProvider
const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "search",
        element: <DocumentSearch />,
      },
      {
        path: "dashboard",
        element: <LibrarianDashboard />,
      },
      {
        path: "account",
        element: <AccountInfo />,
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);