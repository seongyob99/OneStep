import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";  // AuthContext를 import
import "@styles/Layout.scss";
import { Container } from "react-bootstrap";
import { BiSolidMessage } from "react-icons/bi";
import { PiCopyrightBold } from "react-icons/pi";

const Layout = () => {
    const navigate = useNavigate();
    const { authState, logout } = useAuth();

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

                        {authState.isAuthenticated ? (
                            <>
                                {/* 로그인 상태에서 사용자 이름을 표시하고, 로그아웃 버튼을 추가 */}
                                <span>환영합니다, {authState.user?.username || "사용자"}님!</span>
                                <button className="login-btn" onClick={logout}>로그아웃</button>
                            </>
                        ) : (
                            <button className="login-btn" onClick={() => navigate("/member/login")}>로그인</button>
                        )}
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
