// package com.nusiss.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {
//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**") // all paths
//             .allowedOrigins(
//                 "http://localhost:3000",
//                 "https://nus-iss-swe-5006-project-git-frontend-shihui21s-projects.vercel.app",
//                 "https://nus-iss-swe-5006-project.vercel.app"
//             )
//             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//             .allowedHeaders("*")
//             .exposedHeaders("Authorization")
//             .allowCredentials(true)
//             .maxAge(3600); // Cache preflight request for 1 hour
//     }
// }