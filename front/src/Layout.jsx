import { Outlet } from 'react-router-dom';
import '@styles/Layout.scss';
import { Container } from 'react-bootstrap';

const Layout = () => {
    return (
        <div className="layout">
            <header className="header">
                <Container>
                    {/* <div><img src='../src/assets/img/ONESTEP-logo.png' alt='ONESTEP Logo' />header</div> */}
                    <div>header</div>
                </Container>
            </header>
            <main className="main">
                <Outlet />
            </main>
            <footer className="footer">
                <Container>
                    <div>Footer</div>
                </Container>
            </footer>
        </div>
    );
};

export default Layout;
