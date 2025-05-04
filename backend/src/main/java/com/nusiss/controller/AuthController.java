package com.nusiss.controller;

import com.nusiss.dto.LoginDTO;
import com.nusiss.dto.CreateUserDTO;
import com.nusiss.service.AuthService;
import com.nusiss.service.UserService;
import com.nusiss.service.ValidationService;
import com.nusiss.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userDetailsService;
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final ValidationService validationService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userDetailsService, AuthService authService,
                          JwtUtil jwtUtil, ValidationService validationService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.validationService = validationService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody @Valid CreateUserDTO createUserDTO, BindingResult bindingResult) {

        Map<String, String> errors = new HashMap<>();

        if (bindingResult.hasErrors()) {
            bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );
        }

        Map<String, String> serviceErrors = validationService.validateUserInput(createUserDTO);

        serviceErrors.forEach(errors::putIfAbsent); // Don't overwrite existing field errors

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        return authService.createUser(createUserDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody @Valid LoginDTO loginDTO, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        // authenticationManager.authenticate(
        //         new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
        // );

        // final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getUsername());
        // String token = jwtUtil.generateToken(userDetails.getUsername());

        // Map<String, String> response = new HashMap<>();
        // response.put("token", token);

        // return ResponseEntity.ok(response);
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getIdentifier());
            String token = jwtUtil.generateToken(userDetails.getUsername());

//        // After login, trigger the WebSocket connection for notifications
//        WebSocketSession session = getWebSocketSession(userDetails.getUsername());
//        if (session != null && session.isOpen()) {
//            // Handle notifications for the logged-in user here
//        }

            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.ok(response);

        // } catch (UsernameNotFoundException e) {
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        //             .body(Map.of("error", "User not found"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication failed"));
        }
    }
}
