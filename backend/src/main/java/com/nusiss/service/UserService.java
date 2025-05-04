package com.nusiss.service;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.UpdatePasswordDTO;
import com.nusiss.dto.GetUserDetailsDTO;
import com.nusiss.dto.UpdateUserDetailsDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.ChangeTrackerUtil;
import com.nusiss.util.PasswordUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final ValidationService validationService;

    @Autowired
    public UserService(UserRepository userRepository, ValidationService validationService) {
        this.userRepository = userRepository;
        this.validationService = validationService;
    }

    public ResponseEntity<String> updateUser(UUID id, UpdateUserDetailsDTO updateUserDetailsDTO) {

        System.out.println("Inside updateUser method");

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        List<String> changes = new ArrayList<>();

        if(!validationService.isUsernameValid(updateUserDetailsDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Username. Username should be 6 - 30 characters long and should not contain any special characters except '_'");
        }

        if(!validationService.isEmailValid(updateUserDetailsDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid email format!");
        }

        if (ChangeTrackerUtil.hasChanged(user.getUsername(), updateUserDetailsDTO.getUsername())) {
            if (validationService.isUsernameTaken(updateUserDetailsDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
            }
            user.setUsername(updateUserDetailsDTO.getUsername());
            changes.add("Username");
        }

        if(ChangeTrackerUtil.hasChanged(user.getEmail(), updateUserDetailsDTO.getEmail())) {
            if(validationService.isEmailTaken(updateUserDetailsDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
            }
            user.setEmail(updateUserDetailsDTO.getEmail());
            changes.add("Email");
        }

        if(ChangeTrackerUtil.hasChanged(user.getName(), updateUserDetailsDTO.getName())) {
            user.setName(updateUserDetailsDTO.getName());
            changes.add("Name");
        }

        if (ChangeTrackerUtil.hasChanged(user.getMobileNumber(), updateUserDetailsDTO.getMobileNumber())) {
            user.setMobileNumber(updateUserDetailsDTO.getMobileNumber());
            changes.add("Mobile Number");
        }

        if (ChangeTrackerUtil.hasChanged(user.getLocation(), updateUserDetailsDTO.getLocation())) {
            user.setLocation(updateUserDetailsDTO.getLocation());
            changes.add("Region");
        }

        if (!changes.isEmpty()) {
            userRepository.save(user);
            changes.forEach(change -> System.out.println("Changed: " + change));
            return ResponseEntity.status(HttpStatus.OK)
                    .body("User updated successfully. Changes: " + String.join(", ", changes));
        } else {
            return ResponseEntity.ok("No changes were made.");
        }
    }

    public ResponseEntity<String> updatePassword(UUID id, UpdatePasswordDTO updatePasswordDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        if(!PasswordUtil.matches(updatePasswordDTO.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }
        if (!validationService.isPasswordValid(updatePasswordDTO.getNewPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters long, include at least one letter, one number, and one symbol, and must not contain any spaces.");
        }

        user.setPassword(updatePasswordDTO.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    public GetUserDetailsDTO getUserByID(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        return new GetUserDetailsDTO(user);
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) {
        User user = userRepository.findByUsernameIgnoreCase(identifier).orElseGet(() -> {
            return userRepository.findByEmailIgnoreCase(identifier)
                    .orElse(null);
        });

        return new AuthenticateUser(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>() // Authorities/roles — leave empty for now
        );
    }
}
