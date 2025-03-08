import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard';
import AdminPage from './pages/AdminPage/AdminPage';

import "./elio-react-components/styles/base.css"
// import "./elio-react-components/styles/fonts.css"
import "./elio-react-components/styles/ui.css"

import AOS from 'aos';
import 'aos/dist/aos.css'; 
AOS.init();


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
