import { Outlet, useNavigate } from "react-router-dom";
import "@styles/Layout.scss";
import { Container } from "react-bootstrap";
import { BiSolidMessage } from "react-icons/bi";
import { PiCopyrightBold } from "react-icons/pi";
const Layout = () => {
    const navigate = useNavigate();

    return (
        <div className="layout">
            <header className="header">
                <Container>
                    <div className="logo" onClick={() => navigate("/")}>
                        <img src="../src/assets/img/ONESTEP-logo.png" alt="ONESTEP Logo" />
                    </div>
                    <div className="header-right">
                        <div className="chat" onClick={() => navigate("/chat")}><BiSolidMessage /></div>
                        <button className="login-btn">로그인</button>
                    </div>
                </Container>
            </header>

            <main className="main">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div><PiCopyrightBold /> 2025 ONESTEP. All Rights Reserved.</div>
                    <div>Address : Busan IT Training Center, Room 501</div>
                    <div>GIT : https://github.com/dltkdgus3769/OneStep</div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
