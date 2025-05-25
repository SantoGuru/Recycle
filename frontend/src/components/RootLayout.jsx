import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';

export default function RootLayout() {
    return (
        <>
            <Navbar />
            <main className="bg-slate-100">
                <Outlet />
            </main>
        </>
    )
}