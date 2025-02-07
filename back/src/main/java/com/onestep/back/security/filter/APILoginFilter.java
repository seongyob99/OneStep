package com.onestep.back.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onestep.back.domain.Members;
import com.onestep.back.util.JWTUtil;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Log4j2
public class APILoginFilter extends UsernamePasswordAuthenticationFilter {

    private final JWTUtil jwtUtil;

    public APILoginFilter(String loginUrl, AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        setFilterProcessesUrl(loginUrl);
        setAuthenticationManager(authenticationManager);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        try {
            Map<String, String> credentials = new ObjectMapper().readValue(request.getInputStream(), Map.class);
            String username = credentials.get("memberId");
            log.info("username: " + username);
            String password = credentials.get("password");
            log.info("password: " + password);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(username, password);

            return getAuthenticationManager().authenticate(authenticationToken);
        } catch (IOException e) {
            throw new RuntimeException("Login request parsing failed");
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException {

        String username = authResult.getName();
        UserDetails userDetails = (UserDetails) authResult.getPrincipal();

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("email", userDetails.getUsername());

        String accessToken = jwtUtil.generateToken(claims, username, false);
        String refreshToken = jwtUtil.generateToken(claims, username, true);
        log.info("refreshToken: " + refreshToken);


        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }

}