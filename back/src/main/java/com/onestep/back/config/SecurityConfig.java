package com.onestep.back.config;

import com.onestep.back.security.APIUserDetailsService;
import com.onestep.back.security.filter.APILoginFilter;
import com.onestep.back.security.filter.RefreshTokenFilter;
import com.onestep.back.security.filter.TokenCheckFilter;
import com.onestep.back.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final APIUserDetailsService apiUserDetailsService;
    private final JWTUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable());
        http.cors(Customizer.withDefaults());

        // Spring Security의 로그인 관련 필터 및 JWT 인증 필터 추가
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder
                .userDetailsService(apiUserDetailsService)  // 사용자 인증 처리
                .passwordEncoder(passwordEncoder());       // 비밀번호 암호화 처리

        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        // 로그인 필터 설정
        APILoginFilter apiLoginFilter = new APILoginFilter("/generateToken", authenticationManager, jwtUtil);
        apiLoginFilter.setAuthenticationManager(authenticationManager);


        // 로그인 필터를 UsernamePasswordAuthenticationFilter 앞에 배치
        http.addFilterBefore(apiLoginFilter, UsernamePasswordAuthenticationFilter.class);

        // JWT 토큰 검증 필터 추가
        http.addFilterBefore(
                new TokenCheckFilter(jwtUtil),
                UsernamePasswordAuthenticationFilter.class
        );

        // 리프레시 토큰 필터 추가
        http.addFilterBefore(
                new RefreshTokenFilter("/refreshToken", jwtUtil),
                TokenCheckFilter.class
        );

        // 세션 관리 비활성화, Stateless 설정
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    // CORS 설정 유지
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);  // 자격 증명 허용
        config.addAllowedOrigin("http://localhost:5173");  // React 앱 URL
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");  // 모든 HTTP 메소드 허용

        source.registerCorsConfiguration("/**", config);  // 모든 엔드포인트에 CORS 설정

        return new CorsFilter(source);
    }

    // PasswordEncoder 설정 유지
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

