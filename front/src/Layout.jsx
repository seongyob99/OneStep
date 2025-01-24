import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 100,
                background: 'lightyellow',
                zIndex: 1000, // 맨 앞으로
            }}>
                <div>Header</div>
            </header>
            <main style={{
                flexGrow: 1,
                paddingTop: 100, // header 높이
                overflowY: 'auto',
            }}>
                <Outlet />
            </main>
            <footer style={{
                height: 100,
                background: 'beige',
                marginTop: 'auto',
            }}>
                <div>Footer</div>
            </footer>
        </div>
    );
};

export default Layout;
