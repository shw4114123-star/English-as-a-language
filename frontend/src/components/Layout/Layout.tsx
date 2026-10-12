import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';
import './Layout.css';

export const Layout: React.FC = () => {
    return (
        <div className="layout-wrapper">
            <Navbar />
            <main className="layout-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
export default Layout;
