package com.nusiss.service;

import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@Transactional
public class PasswordService {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    public PasswordService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<String> updatePassword(UUID id, String currentPassword, String newPassword) {
        User user = userRepository.getUserById(id).orElseThrow(() -> new UserNotFoundException(id));

        if(!PasswordUtil.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }
        if (!validationService.isPasswordValid(newPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters long, include at least one letter, one number, and one symbol, and must not contain any spaces.");
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}
