import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard';
import AdminPage from './pages/AdminPage/AdminPage';

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

import "./elio-react-components/styles/base.css"
// import "./elio-react-components/styles/fonts.css"
import "./elio-react-components/styles/ui.css"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/convidat/:invitationCode',
    element: <Dashboard />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
]);

createRoot(document.getElementById('root')).render(

<RouterProvider router={router}/>
  )
