//package com.nusiss.demo;
//
//import com.nusiss.entity.User;
//import com.nusiss.repository.UserRepository;
//import com.nusiss.dto.UserCreateDTO;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.http.MediaType;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//
//@SpringBootTest
//@EnableAutoConfiguration
//@AutoConfigureMockMvc
//public class UserControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    @Test
//    public void testCreateUser() throws Exception {
//        UserCreateDTO newUser = new UserCreateDTO();
//        newUser.setUsername("pokemonneo123");
//        newUser.setPassword("pokemonneo123");
//        newUser.setEmail("pokemonneo123@gmail.com");
//        newUser.setName("pokemonneo123");
//        newUser.setLocation("Singapore");
//        newUser.setMobileNumber("12345678");
//
//        mockMvc.perform(post("/api/user/register") // Assuming your controller's POST endpoint is "/api/users"
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(newUser))) // Convert the object to JSON
//                .andExpect(status().isCreated()) // Expect HTTP 201 Created
//                .andExpect(jsonPath("$.username").value("pokemonneo123")) // Validate the response body
//                .andExpect(jsonPath("$.id").isNotEmpty()); // Validate that the user ID is not empty
//
//        // Optionally: Verify that the user was saved in the database
//        User savedUser = userRepository.findUserByUsername("pokemonneo123").orElseThrow();
//        assertEquals("pokemonneo123", savedUser.getUsername());
//    }
//
//}
