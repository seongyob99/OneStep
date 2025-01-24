import { Outlet } from 'react-router-dom';
import '@styles/Layout.scss';

const Layout = () => {
    return (
        <div className="layout">
            <header className="header">
                <div>Header</div>
            </header>
            <main className="main">
                <Outlet />
            </main>
            <footer className="footer">
                <div>Footer</div>
            </footer>
        </div>
    );
};

export default Layout;
