import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import FarmHome from './Pages/farmHome.jsx';
import FarmInput from './Pages/farminput.jsx';
import "leaflet/dist/leaflet.css";
import FarmQR from './Pages/farmQR.jsx';
import Login from './Pages/login.jsx';
import ScannedDetails from './Pages/scannedDetails.jsx';
import ProcessInput from './Pages/processInp.jsx';
import ProcessHome from './Pages/processhome.jsx';
import ProcessQR from './Pages/processQR.jsx';
import RetailHome from './Pages/retailHome.jsx';
import RetailInput from './Pages/retailInp.jsx';
import RetailQR from './Pages/retailQR.jsx';
import Costumer from './Pages/costumer.jsx';


const router = createBrowserRouter([
  { 
    path : '/farmhome',
    element: <FarmHome />,
    errorElement: <h1>❌ Error in FarmHome</h1>
  },
  { 
    path : '/farminput',
    element: <FarmInput />,
    errorElement: <h1>❌ Error in FarmInput</h1>
  },
  {
    path: '/farmqr',
    element: <FarmQR />,
    errorElement: <h1>❌ Error in FarmQR</h1>
  },
  {
    path: '/',
    element: <Login />,
    errorElement: <h1>❌ Error in Login</h1>
  },
  {
    path: "/scanned",
    element: <ScannedDetails />
  },
  {
    path: "/processhome",
    element: <ProcessHome />
  },
  {
    path: "/processinp",
    element: <ProcessInput />
  },
  {
    path: '/processqr',
    element: <ProcessQR />
  },
  {
    path: '/retailhome',
    element: <RetailHome />
  },
  {
    path: '/retailinp',
    element: <RetailInput />
  },
  {
    path: '/retailqr',
    element: <RetailQR />
  },
  {
    path: '/costumer',
    element: <Costumer />
  }
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
