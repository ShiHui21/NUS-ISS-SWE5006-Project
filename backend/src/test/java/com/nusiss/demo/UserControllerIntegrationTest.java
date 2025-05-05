package com.nusiss.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusiss.config.AuthenticateUser;
import com.nusiss.entity.User;
import com.nusiss.enums.Region;
import com.nusiss.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
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

        // Insert a conflicting username
        User conflictingUser = new User();
        conflictingUser.setUsername("newUsername123");
        conflictingUser.setPassword("Password1234!");
        conflictingUser.setEmail("newUser123@gmail.com");
        conflictingUser.setName("New Name");
        conflictingUser.setMobileNumber("87654321");
        conflictingUser.setRegion(Region.NORTH_REGION);
        userRepository.save(conflictingUser);  // Save the conflicting user to DB

    }

//    @Test// Mocking the logged-in user
//    void updateUser_withDuplicateUsername() throws Exception {
//        // Prepare the data to update the user
//        UpdateUserDetailsDTO updateUserDetailsDTO = new UpdateUserDetailsDTO();
//        updateUserDetailsDTO.setUsername("newUsername123");  // Duplicate username
//        updateUserDetailsDTO.setEmail("existingUser@gmail.com");
//        updateUserDetailsDTO.setName("Updated Name");
//        updateUserDetailsDTO.setMobileNumber("12345678");
//        updateUserDetailsDTO.setRegion("North-East");
//
//        // Perform the request
//        mockMvc.perform(put("/user/update-details")
//                        .contentType("application/json")
//                        .content(objectMapper.writeValueAsString(updateUserDetailsDTO)))
//                .andExpect(status().isConflict())  // Expecting 409 Conflict for duplicate username
//                .andExpect(content().string("Username is already in use!"));  // Expecting error message for duplicate username
//    }
}
