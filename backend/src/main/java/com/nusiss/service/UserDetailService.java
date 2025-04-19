package com.nusiss.service;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.UserDTO;
import com.nusiss.dto.UserUpdateDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.ChangeTrackerUtil;
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
public class UserDetailService implements UserDetailsService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    public UserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<String> updateUser(UUID id, UserUpdateDTO userUpdateDTO) {

        System.out.println("Inside updateUser method");

        User user = userRepository.getUserById(id).orElseThrow(() -> new UserNotFoundException(id));

        List<String> changes = new ArrayList<>();

        if(!validationService.isUsernameValid(userUpdateDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Username. Username should be 6 - 30 characters long and should not contain any special characters except '_'");
        }

        if(!validationService.isEmailValid(userUpdateDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid email format!");
        }

        if (ChangeTrackerUtil.hasChanged(user.getUsername(), userUpdateDTO.getUsername())) {
            if (validationService.isUsernameTaken(userUpdateDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
            }
            user.setUsername(userUpdateDTO.getUsername());
            changes.add("Username");
        }

        if(ChangeTrackerUtil.hasChanged(user.getEmail(), userUpdateDTO.getEmail())) {
            if(validationService.isEmailTaken(userUpdateDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
            }
            user.setEmail(userUpdateDTO.getEmail());
            changes.add("Email");
        }

        if(ChangeTrackerUtil.hasChanged(user.getName(), userUpdateDTO.getName())) {
            user.setName(userUpdateDTO.getName());
            changes.add("Name");
        }

        if (ChangeTrackerUtil.hasChanged(user.getMobileNumber(), userUpdateDTO.getMobileNumber())) {
            user.setMobileNumber(userUpdateDTO.getMobileNumber());
            changes.add("Mobile Number");
        }

        if (ChangeTrackerUtil.hasChanged(user.getLocation(), userUpdateDTO.getLocation())) {
            user.setLocation(userUpdateDTO.getLocation());
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
    public UserDTO getUserByID(UUID id) {
        User user = userRepository.getUserById(id).orElseThrow(() -> new UserNotFoundException(id));
        return new UserDTO(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.getUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new AuthenticateUser(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>() // Authorities/roles — leave empty for now
        );
    }
}
