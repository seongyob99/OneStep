package com.onestep.back.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onestep.back.util.JWTUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class RefreshTokenFilter extends OncePerRequestFilter {

    private final String refreshTokenUrl;
    private final JWTUtil jwtUtil;

    public RefreshTokenFilter(String refreshTokenUrl, JWTUtil jwtUtil) {
        this.refreshTokenUrl = refreshTokenUrl;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        if (!request.getRequestURI().equals(refreshTokenUrl) || !"POST".equals(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            if (jwtUtil.isTokenValid(token)) {
                Claims claims = jwtUtil.parseToken(token);
                String username = claims.getSubject();
                String newAccessToken = jwtUtil.generateToken(claims, username, false);

                Map<String, String> tokens = new HashMap<>();
                tokens.put("accessToken", newAccessToken);

                response.setContentType("application/json");
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
            }

        }
    }
}
