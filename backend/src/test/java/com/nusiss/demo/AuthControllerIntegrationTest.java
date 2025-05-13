package com.nusiss.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.CreateUserDTO;
import com.nusiss.entity.User;
import com.nusiss.enums.Region;
import com.nusiss.repository.UserRepository;
import com.nusiss.service.AuthService;
import com.nusiss.service.ValidationService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;


import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ExtendWith(MockitoExtension.class)
@TestPropertySource("classpath:application-test.properties")
public class AuthControllerIntegrationTest {


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Insert an existing user with username "existingUsername"
        User user = new User();
        user.setUsername("existingUsername");
        user.setPassword("Password1234!");
        user.setEmail("existingUser@gmail.com");
        user.setName("existing Name");
        user.setMobileNumber("12345678");
        user.setRegion(Region.CENTRAL_REGION);
        userRepository.save(user);

        AuthenticateUser authenticateUser = new AuthenticateUser(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(authenticateUser, null, authenticateUser.getAuthorities())
        );
    }

    @Test
    void createUser_validInput() throws Exception {

        CreateUserDTO createUserDTO = new CreateUserDTO();
        createUserDTO.setName("test123");
        createUserDTO.setPassword("Password1234!");
        createUserDTO.setUsername("test123");
        createUserDTO.setEmail("test123@gmail.com");
        createUserDTO.setRegion("North Region");
        createUserDTO.setMobileNumber("12344556");

        // Perform the test request to /register endpoint
        mockMvc.perform(post("/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(createUserDTO)))
                .andExpect(status().isCreated()) // Expect 201 Created status
                .andExpect(content().string("User created successfully!")); // Expect success message
    }

    @Test
    void createUser_existingUser() throws Exception {

        CreateUserDTO createUserDTO = new CreateUserDTO();
        createUserDTO.setName("test123");
        createUserDTO.setPassword("Password1234!");
        createUserDTO.setUsername("existingUsername");
        createUserDTO.setEmail("test123@gmail.com");
        createUserDTO.setRegion("North Region");
        createUserDTO.setMobileNumber("12344556");

        // Perform the test request to /register endpoint
        mockMvc.perform(post("/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(createUserDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().json("{\"username\":\"Username is already in use.\"}")); // Expect success message
    }

}
