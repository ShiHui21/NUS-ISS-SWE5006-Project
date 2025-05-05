package com.nusiss.demo;

import com.nusiss.service.UserService;
import com.nusiss.service.ValidationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
public class ValidationServiceTest {

    @InjectMocks
    private ValidationService validationService;

    @Test
    public void testIsUsernameValid_ValidUsername() {
        // Act
        boolean result = validationService.isUsernameValid("JaneDoe");

        // Assert
        assertTrue(result);
    }

    @Test
    public void testIsUsernameValid_InvalidUsername() {
        // Act
        boolean result = validationService.isUsernameValid("Jane Doe");

        // Assert
        assertFalse(result);
    }

    @Test
    public void testIsEmailValid_InvalidEmail() {
        // Act
        boolean result = validationService.isEmailValid("hahah.com");

        // Assert
        assertFalse(result);
    }

    @Test
    public void testIsEmailValid_ValidEmail() {
        // Act
        boolean result = validationService.isEmailValid("janedoe@gmail.com");

        // Assert
        assertTrue(result);
    }
}
