import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const initialAuthState = {
    isAuthenticated: false,
    user: null,
    refreshToken: null,
};

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(initialAuthState);

    // localStorage에서 로그인 정보 불러오기
    useEffect(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedAccessToken && storedRefreshToken) {
            try {
                const decodedToken = jwtDecode(storedAccessToken);
                setAuthState({
                    isAuthenticated: true,
                    user: { username: decodedToken.username }, // ✅ user 객체에 username 포함
                    refreshToken: storedRefreshToken,
                });
            } catch (error) {
                console.error("토큰 디코딩 실패:", error);
                logout(); // ✅ 토큰이 잘못된 경우 로그아웃 처리
            }
        }
    }, []);

    const login = (accessToken, refreshToken) => {
        try {
            const decodedToken = jwtDecode(accessToken);
            const username = decodedToken.username;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setAuthState({
                isAuthenticated: true,
                user: { username }, // ✅ user 객체에 username 포함
                refreshToken,
            });
        } catch (error) {
            console.error("토큰 디코딩 실패:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthState(initialAuthState);
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
