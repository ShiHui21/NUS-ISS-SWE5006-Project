//package com.nusiss.demo;
//
//import com.nusiss.dto.UserCreateDTO;
//import com.nusiss.entity.User;
//import com.nusiss.repository.UserRepository;
//import com.nusiss.service.RegisterService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mockito;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.bean.override.mockito.MockitoBean;
//import org.springframework.transaction.annotation.Transactional;
//
//import javax.sql.DataSource;
//import java.sql.Connection;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@SpringBootTest
//@TestPropertySource("classpath:application.properties")
//@ExtendWith(MockitoExtension.class)
//public class UserServiceImplTest {
//
//    @Autowired
//    private UserRepository userRepository; // Use the real repository
//
//    @Autowired
//    private RegisterService registerService;
//
//    @Test
//    @Transactional
//    @Rollback(false)
//    public void testRegisterUser_Success() {
//        // Given
//        UserCreateDTO dto = new UserCreateDTO();
//        dto.setUsername("pokemonneo123");
//        dto.setPassword("StrongPass123");
//        dto.setEmail("pokemonneo123@gmail.com");
//        dto.setName("Ash Ketchum");
//        dto.setLocation("Singapore");
//        dto.setMobileNumber("12345678");
//
//        // When
//        ResponseEntity<String> response = registerService.registerUser(dto);
//
//        // Then
//        assertEquals(201, response.getStatusCodeValue());
//        assertEquals("User registered successfully!", response.getBody());
//
//        // Verify the user was saved in the DB
//        User savedUser = userRepository.findUserByUsername("pokemonneo123").orElse(null);
//        assertNotNull(savedUser);
//        System.out.println("User saved in DB: " + savedUser);
//    }
//
//}
