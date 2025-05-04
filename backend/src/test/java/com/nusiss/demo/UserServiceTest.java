package com.nusiss.demo;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.GetUserDetailsDTO;
import com.nusiss.dto.UpdateUserDetailsDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.service.UserService;
import com.nusiss.service.ValidationService;
import com.nusiss.util.ChangeTrackerUtil;
import com.nusiss.util.PasswordUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
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

        // Freeze original values before updateUser mutates them
        String oldUsername = "JohnDoe";
        final String oldEmail = "johndoe@email.com";
        final String oldName = "John Doe";
        final String oldMobile = "12345678";
        final String oldLocation = "North-East";

        String newUsername = "JaneDoe";
        final String newEmail = "janedoe@email.com";
        final String newName = "John Doe"; // same
        final String newMobile = "12345678"; // same
        final String newLocation = "North-East"; // same

        User mockExistingUser = new User();
        mockExistingUser.setId(userId);
        mockExistingUser.setUsername(oldUsername);
        mockExistingUser.setEmail(oldEmail);
        mockExistingUser.setName(oldName);
        mockExistingUser.setMobileNumber(oldMobile);
        mockExistingUser.setLocation(oldLocation);

        UpdateUserDetailsDTO updateUserDetailsDTO = new UpdateUserDetailsDTO();
        updateUserDetailsDTO.setUsername(newUsername);
        updateUserDetailsDTO.setEmail(newEmail);
        updateUserDetailsDTO.setName(newName);
        updateUserDetailsDTO.setMobileNumber(newMobile);
        updateUserDetailsDTO.setLocation(newLocation);

        // Mocks
        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(mockExistingUser));
        Mockito.when(validationService.isEmailTaken(newEmail)).thenReturn(false);
        Mockito.when(validationService.isUsernameTaken(newUsername)).thenReturn(false);
        Mockito.when(validationService.isEmailValid(newEmail)).thenReturn(true);
        Mockito.when(validationService.isUsernameValid(newUsername)).thenReturn(true);

        try (MockedStatic<ChangeTrackerUtil> mockedChangeTracker = Mockito.mockStatic(ChangeTrackerUtil.class)) {
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldUsername, newUsername)).thenReturn(true);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldEmail, newEmail)).thenReturn(true);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldName, newName)).thenReturn(false);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldMobile, newMobile)).thenReturn(false);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldLocation, newLocation)).thenReturn(false);

            // Act
            ResponseEntity<String> response = userService.updateUser(userId, updateUserDetailsDTO);

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertTrue(response.getBody().contains("User updated successfully"));
            assertTrue(response.getBody().contains("Username"));
            assertTrue(response.getBody().contains("Email"));

            // Verify
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldUsername, newUsername));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldEmail, newEmail));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldName, newName));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldMobile, newMobile));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldLocation, newLocation));
        }
    }

    @Test
    public void testUpdateUser_NoChangesMade() {

        UUID userId = UUID.randomUUID();

        String oldUsername = "JohnDoe";
        final String oldEmail = "johndoe@email.com";
        final String oldName = "John Doe";
        final String oldMobile = "12345678";
        final String oldLocation = "North-East";

        String newUsername = "JohnDoe";
        final String newEmail = "johndoe@email.com";
        final String newName = "John Doe";
        final String newMobile = "12345678";
        final String newLocation = "North-East";

        User mockExistingUser = new User();
        mockExistingUser.setId(userId);
        mockExistingUser.setUsername(oldUsername);
        mockExistingUser.setEmail(oldEmail);
        mockExistingUser.setName(oldName);
        mockExistingUser.setMobileNumber(oldMobile);
        mockExistingUser.setLocation(oldLocation);

        UpdateUserDetailsDTO updateUserDetailsDTO = new UpdateUserDetailsDTO();
        updateUserDetailsDTO.setUsername(newUsername);
        updateUserDetailsDTO.setEmail(newEmail);
        updateUserDetailsDTO.setName(newName);
        updateUserDetailsDTO.setMobileNumber(newMobile);
        updateUserDetailsDTO.setLocation(newLocation);

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(mockExistingUser));
        Mockito.when(validationService.isUsernameValid("JohnDoe")).thenReturn(true);
        Mockito.when(validationService.isEmailValid("johndoe@email.com")).thenReturn(true);

        // Mocks
        try (MockedStatic<ChangeTrackerUtil> mockedChangeTracker = Mockito.mockStatic(ChangeTrackerUtil.class)) {
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldUsername, newUsername)).thenReturn(false);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldEmail, newEmail)).thenReturn(false);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldName, newName)).thenReturn(false);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldMobile, newMobile)).thenReturn(false);
            mockedChangeTracker.when(() -> ChangeTrackerUtil.hasChanged(oldLocation, newLocation)).thenReturn(false);

            // Act
            ResponseEntity<String> response = userService.updateUser(userId, updateUserDetailsDTO);

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("No changes were made.", response.getBody());

            // Verify
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldUsername, newUsername));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldEmail, newEmail));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldName, newName));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldMobile, newMobile));
            mockedChangeTracker.verify(() -> ChangeTrackerUtil.hasChanged(oldLocation, newLocation));
        }
    }

    @Test
    public void testLoadByUsername_UsernameExists() {
        // Arrange
        User mockUser = new User();
        mockUser.setId(UUID.fromString("4a86cf4f-c72a-4668-8e5b-be95f83e82ce"));
        mockUser.setUsername("JohnDoe");
        mockUser.setName("John Doe");
        mockUser.setPassword("Password1234!");
        mockUser.setEmail("johndoe@gmail.com");
        mockUser.setLocation("North-East");
        mockUser.setMobileNumber("12345678");
        Mockito.when(userRepository.findByUsernameIgnoreCase(mockUser.getUsername())).thenReturn(Optional.of(mockUser));

        // Act
        UserDetails result = userService.loadUserByUsername(mockUser.getUsername());

        // Assert
        assertNotNull(result);
        assertEquals("JohnDoe", result.getUsername());
        assertTrue(PasswordUtil.matches("Password1234!", result.getPassword()));
    }

}
