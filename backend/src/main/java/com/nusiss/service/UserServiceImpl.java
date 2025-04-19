package com.nusiss.service;

import com.nusiss.dto.UserCreateDTO;
import com.nusiss.dto.UserDTO;
import com.nusiss.dto.UserUpdateDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.ChangeTrackerUtil;

import com.nusiss.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public ResponseEntity<String> registerUser(UserCreateDTO userCreateDTO) {
        System.out.println("Inside registerUser method");
        if(!isUsernameValid(userCreateDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Username. Username should be 6 - 30 characters long and should not contain any special characters except '_'");
        }
        if(isUsernameTaken(userCreateDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
        }

        if(!isEmailValid(userCreateDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid email format!");
        }

        if(isEmailTaken(userCreateDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
        }

//          User user = User.fromDTO(userCreateDTO);
            User user = new User();
            user.setUsername(userCreateDTO.getUsername());
            user.setPassword(userCreateDTO.getPassword());
            user.setName(userCreateDTO.getName());
            user.setEmail(userCreateDTO.getEmail());
            user.setMobileNumber(userCreateDTO.getMobileNumber());
            user.setLocation(userCreateDTO.getLocation());

            userRepository.save(user);
            System.out.println("User saved successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

    @Override
    public ResponseEntity<String> updateUser(UUID id, UserDTO userDTO) {
        System.out.println("Inside updateUser method");

        User user = userRepository.getUserById(id).orElseThrow(() -> new UserNotFoundException(id));

        List<String> changes = new ArrayList<>();

        if(!isUsernameValid(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Username. Username should be 6 - 30 characters long and should not contain any special characters except '_'");
        }

        if(!isEmailValid(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid email format!");
        }

        if (ChangeTrackerUtil.hasChanged(user.getUsername(), userDTO.getUsername())) {
            if (isUsernameTaken(userDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
            }
            user.setUsername(userDTO.getUsername());
            changes.add("Username");
        }

        if(ChangeTrackerUtil.hasChanged(user.getEmail(), userDTO.getEmail())) {
            if(isEmailTaken(userDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
            }
            user.setEmail(userDTO.getEmail());
            changes.add("Email");
        }

        if(ChangeTrackerUtil.hasChanged(user.getName(), userDTO.getName())) {
            user.setName(userDTO.getName());
            changes.add("Name");
        }

        if (ChangeTrackerUtil.hasChanged(user.getMobileNumber(), userDTO.getMobileNumber())) {
            user.setMobileNumber(userDTO.getMobileNumber());
            changes.add("Mobile Number");
        }

        if (ChangeTrackerUtil.hasChanged(user.getLocation(), userDTO.getLocation())) {
            user.setLocation(userDTO.getLocation());
            changes.add("Location");
        }

        if (!changes.isEmpty()) {
            userRepository.save(user);
            changes.forEach(change -> System.out.println("Changed: " + change));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User updated successfully. Changes: " + String.join(", ", changes));
        } else {
            return ResponseEntity.ok("No changes were made.");
        }
    }

    @Override
    public ResponseEntity<String> updatePassword(UUID id, String currentPassword, String newPassword) {
        User user = userRepository.getUserById(id).orElseThrow(() -> new UserNotFoundException(id));

        if(!PasswordUtil.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }
        if (!isPasswordValid(newPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters long, include at least one letter, one number, and one symbol, and must not contain any spaces.");
        }

        user.setPassword(PasswordUtil.hashPassword(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }


    @Override
    public UserDTO getUserByID(UUID id) {
        User user = userRepository.getUserById(id).orElseThrow(() -> new UserNotFoundException(id));
            return new UserDTO(user);
    }

    public boolean isEmailValid(String email) {
//        String emailRegex = "^[A-Za-z0-9+_.-]{6,30}@[A-Za-z0-9]{2,}(\\.[A-Za-z]{2,})+$";
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        System.out.println("Validating email: " + email + " -> " + email.matches(emailRegex));
        return email.matches(emailRegex);
    }
    public boolean isEmailTaken(String email) {
        System.out.println("Checking if email exists: " + email); // This should print to the console
        Optional<User> existingEmail = userRepository.findUserByEmail(email);
        System.out.println("Checking if email exists: " + email + ", Found: " + existingEmail.isPresent());
        return existingEmail.isPresent();
    }

    public boolean isUsernameValid(String username) {
        String usernameRegex = "^(?!.*\\.\\.)(?!.*\\.$)(?!^\\.)[A-Za-z0-9_]{6,30}$";
        return username != null && username.matches(usernameRegex);
    }
    public boolean isUsernameTaken(String username) {
        System.out.println("Checking if username exists: " + username); // This should print to the console
        Optional<User> existingUser = userRepository.findUserByUsername(username);
        System.out.println("Found: " + existingUser.isPresent()); // This should print whether the user is found or not
        return existingUser.isPresent();
    }

    public boolean isPasswordValid(String password) {
        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\\\d)(?=.*[^A-Za-z\\\\d])(?!.*\\\\s).{8,}$";
        return password != null && password.matches(passwordRegex);
    }
}
