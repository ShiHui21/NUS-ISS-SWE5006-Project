package com.nusiss.service;

import com.nusiss.dto.CreateUserDTO;
import com.nusiss.entity.User;
import com.nusiss.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ValidationService {

    @Autowired
    private final UserRepository userRepository;


    @Autowired
    public ValidationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private static final String REGEX = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d])(?!.*\\s).{8,}$"; // Enforces strong password

    public boolean isEmailValid(String email) {
//        String emailRegex = "^[A-Za-z0-9+_.-]{6,30}@[A-Za-z0-9]{2,}(\\.[A-Za-z]{2,})+$";
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        System.out.println("Email input: >" + email + "< (length: " + email.length() + ")");
        System.out.println("Validating email: " + email + " -> " + email.matches(emailRegex));
        return email.matches(emailRegex);
    }

    public boolean isEmailTaken(String email) {
        System.out.println("Checking if email exists: " + email); // This should print to the console
        Optional<User> existingEmail = userRepository.findByEmailIgnoreCase(email);
        return existingEmail.isPresent();
    }

    public boolean isUsernameValid(String username) {
        String usernameRegex = "^(?!.*\\.\\.)(?!.*\\.$)(?!^\\.)[A-Za-z0-9_]{6,30}$";
        return username != null && username.matches(usernameRegex);
    }

    public boolean isUsernameTaken(String username) {
        System.out.println("Checking if username exists: " + username); // This should print to the console
        Optional<User> existingUser = userRepository.findByUsernameIgnoreCase(username);
        System.out.println("Found: " + existingUser.isPresent()); // This should print whether the user is found or not
        return existingUser.isPresent();
    }

    public boolean isPasswordValid(String password) {
        return password != null && password.matches(REGEX);
    }

     public Map<String, String> validateUserInput(CreateUserDTO createUserDTO) {
        Map<String, String> errors = new HashMap<>();

        if (!isUsernameValid(createUserDTO.getUsername())) {
            errors.put("username", "Username must be 6–30 characters and contain only letters, numbers, and underscores.");
        } else if (isUsernameTaken(createUserDTO.getUsername())) {
            errors.put("username", "Username is already in use.");
        }

        if (!isEmailValid(createUserDTO.getEmail())) {
            errors.put("email", "Invalid email format.");
        } else if (isEmailTaken(createUserDTO.getEmail())) {
            errors.put("email", "Email is already in use.");
        }

        if (!isPasswordValid(createUserDTO.getPassword())) {
            errors.put("password", "Password must be at least 8 characters long, include a letter, number, and symbol.");
        }

        return errors;
    }
}
