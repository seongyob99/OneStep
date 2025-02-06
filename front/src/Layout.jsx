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
                        <div className="chat" onClick={() => navigate("/chat")}><BiSolidMessage />
                            <span>chat</span>
                        </div>
                        <button className="login-btn">로그인</button>
                    </div>
                </Container>
            </header>

            <main className="main">
                <Outlet />
            </main>

            <footer className="footer">
                <Container>
                    <div className="footer-content">
                        <div className="footer-left">
                            <p><PiCopyrightBold /> 2025 ONESTEP. All Rights Reserved.</p>
                        </div>
                        {/* <div className="footer-right">
                            <p>GIT : https://github.com/dltkdgus3769/OneStep</p>
                            <p>Address : Busan IT Training Center, Room 501</p>
                        </div> */}
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Layout;
