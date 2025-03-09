import { Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';


export default function RootLayout() {
    return (
        <>
        <main>
            <Outlet />
        </main>
        <ToastContainer />
        </>
    )
}