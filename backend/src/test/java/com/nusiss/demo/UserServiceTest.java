package com.nusiss.demo;

import com.nusiss.dto.GetUserDetailsDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testGetUserById_UserExists() {
        // Arrange
        User mockUser = new User();
        mockUser.setId(UUID.fromString("4a86cf4f-c72a-4668-8e5b-be95f83e82ce"));
        mockUser.setUsername("JohnDoe");
        mockUser.setName("John Doe");
        mockUser.setPassword("Password1234!");
        mockUser.setEmail("johndoe@gmail.com");
        mockUser.setLocation("North-East");
        mockUser.setMobileNumber("12345678");
        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        // Act
        GetUserDetailsDTO result = userService.getUserByID(mockUser.getId());

        // Assert
        assertNotNull(result);
        assertEquals("JohnDoe", result.getUsername());
        assertEquals("John Doe", result.getName());
        assertEquals("johndoe@gmail.com", result.getEmail());
        assertEquals("North-East", result.getLocation());
        assertEquals("12345678", result.getMobileNumber());
    }

    @Test
    public void testGetUserById_UserDoesNotExists() {
        UUID id = UUID.fromString("4a86cf4f-c72a-4668-8e5b-be95f83e82c7");
        Mockito.when(userRepository.findById(id)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.getUserByID(id);
        });

        System.out.println("Exception message: " + exception.getMessage());
    }
}
