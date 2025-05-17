package com.nusiss.config;

import com.nusiss.service.UserService;
import com.nusiss.util.PasswordUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserService userService;  // Inject UserDetailService

    // Constructor Injection for JwtFilter and UserDetailService
    public SecurityConfig(JwtFilter jwtFilter, UserService userService) {
        this.jwtFilter = jwtFilter;
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enforce HTTPS
        //    .requiresChannel(channel -> channel.anyRequest().requiresSecure())

            // Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF disabled because this is a stateless REST API using JWTs for auth.
            // No cookies or sessions are used; CSRF protection is not applicable.
            .csrf(csrf -> csrf.disable())

            // Authorization config
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/").permitAll()
                .anyRequest().authenticated())

            // Stateless session
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Add JWT filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000", 
            "https://nus-iss-swe-5006-project-git-frontend-shihui21s-projects.vercel.app",
            "https://nus-iss-swe-5006-project.vercel.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // PasswordEncoder bean that uses PasswordUtil
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordUtil(); // Use your PasswordUtil class here
    }

    // AuthenticationProvider with the PasswordEncoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);  // Use your user details service to load users
        provider.setPasswordEncoder(passwordEncoder());  // Use PasswordEncoder
        return provider;
    }
}