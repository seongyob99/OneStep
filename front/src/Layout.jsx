import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";
import "@styles/Layout.scss";
import { Container } from "react-bootstrap";
import { BiSolidMessage } from "react-icons/bi";
import { PiCopyrightBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa"; // 마이페이지 아이콘 추가

const Layout = () => {
    const navigate = useNavigate();
    const { authState, logout } = useAuth();

    return (
        <div className="layout">
            <header className="header">
                <Container>
                    <div className="logo-container">
                        <div className="logo" onClick={() => navigate("/")}>
                            <img src="../src/assets/img/ONESTEP-logo.png" alt="ONESTEP Logo" />
                        </div>
                    </div>

                    <div className="header-right">
                        {authState.isAuthenticated && (
                            <div className="welcome-message">
                                <span>환영합니다, {authState.user?.username || "사용자"}님!</span>
                            </div>
                        )}

                        <div className="chat" onClick={() => navigate("/chat")}>
                            <BiSolidMessage />
                            <span>chat</span>
                        </div>

                        {/* 로그인 상태에 따른 버튼 */}
                        {authState.isAuthenticated ? (
                            <>
                                <div className="mypage" onClick={() => navigate("/mypage")}>
                                    <FaUserCircle size={24} />
                                    <span>마이페이지</span>
                                </div>
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
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Layout;
