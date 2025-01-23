import { Outlet } from 'react-router-dom';

const Layout = () => {

    return (
        <div>
            <header style={{ height: 100, background: 'lightyellow' }}>
                <div>Header</div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer style={{ height: 100, background: 'beige' }}>
                <div>Footer</div>
            </footer>
        </div>
    );
};

export default Layout;