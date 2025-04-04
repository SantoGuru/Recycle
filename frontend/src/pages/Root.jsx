import { Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import Navbar from '../components/ui/Navbar';


export default function RootLayout() {
    return (
        <>
        <Navbar />
        <main>
            <Outlet />
        </main>
        <ToastContainer />
        </>
    )
}