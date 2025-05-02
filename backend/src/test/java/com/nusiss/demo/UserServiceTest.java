package com.nusiss.demo;

import com.nusiss.dto.GetUserDetailsDTO;
import com.nusiss.dto.UpdateUserDetailsDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.service.UserService;
import com.nusiss.service.ValidationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private ValidationService validationService;

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

    @Test
    public void testUpdateUser_SuccessfulUpdate() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User mockExistingUser = new User();
        mockExistingUser.setId(userId);
        mockExistingUser.setUsername("JohnDoe");
        mockExistingUser.setEmail("johndoe@email.com");
        mockExistingUser.setName("John Doe");
        mockExistingUser.setMobileNumber("12345678");
        mockExistingUser.setLocation("North-East");

        UpdateUserDetailsDTO updateUserDetailsDTO = new UpdateUserDetailsDTO();
        updateUserDetailsDTO.setUsername("Jane Doe");
        updateUserDetailsDTO.setEmail("janedoe@email.com");
        updateUserDetailsDTO.setName("John Doe");
        updateUserDetailsDTO.setMobileNumber("12345678");
        updateUserDetailsDTO.setLocation("North-East");

        // Mock repository methods
        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(mockExistingUser));

        Mockito.when(validationService.isEmailTaken("janedoe@email.com")).thenReturn(false); // Email is not taken
        Mockito.when(validationService.isUsernameTaken("Jane Doe")).thenReturn(false); // Username is not taken
        Mockito.when(validationService.isEmailValid("janedoe@email.com")).thenReturn(true); // Email is valid
        Mockito.when(validationService.isUsernameValid("Jane Doe")).thenReturn(true); // Username is valid


        // Act
        ResponseEntity<String> response = userService.updateUser(userId, updateUserDetailsDTO);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("User updated successfully"));
        assertTrue(response.getBody().contains("Username"));
        assertTrue(response.getBody().contains("Email"));
    }

    @Test
    public void testUpdateUser_NoChangesMade() {

        UUID userId = UUID.randomUUID();
        User mockExistingUser = new User();
        mockExistingUser.setId(userId);
        mockExistingUser.setUsername("JohnDoe");
        mockExistingUser.setEmail("johndoe@email.com");
        mockExistingUser.setName("John Doe");
        mockExistingUser.setMobileNumber("12345678");
        mockExistingUser.setLocation("North-East");

        UpdateUserDetailsDTO updateUserDetailsDTO = new UpdateUserDetailsDTO();
        updateUserDetailsDTO.setUsername("JohnDoe");
        updateUserDetailsDTO.setEmail("johndoe@email.com");
        updateUserDetailsDTO.setName("John Doe");
        updateUserDetailsDTO.setMobileNumber("12345678");
        updateUserDetailsDTO.setLocation("North-East");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(mockExistingUser));
        Mockito.when(validationService.isUsernameValid("JohnDoe")).thenReturn(true);
        Mockito.when(validationService.isEmailValid("johndoe@email.com")).thenReturn(true);

        ResponseEntity<String> response = userService.updateUser(userId, updateUserDetailsDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("No changes were made.", response.getBody());
    }

}
