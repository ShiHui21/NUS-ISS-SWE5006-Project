package com.nusiss.controller;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.UpdatePasswordDTO;
import com.nusiss.dto.GetUserDetailsDTO;
import com.nusiss.dto.UpdateUserDetailsDTO;
import com.nusiss.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.UUID;

@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update-details")
    public ResponseEntity<String> updateUser(@RequestBody @Valid UpdateUserDetailsDTO updateUserDetailsDTO, @AuthenticationPrincipal
    AuthenticateUser authenticateUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }
        UUID userId = authenticateUser.getUserId();

        return userService.updateUser(userId, updateUserDetailsDTO);
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody @Valid UpdatePasswordDTO updatePasswordDTO, @AuthenticationPrincipal
AuthenticateUser authenticateUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }
        UUID userId = authenticateUser.getUserId();

        return userService.updatePassword(userId, updatePasswordDTO);
    }

    @GetMapping("/get-details")
    public ResponseEntity<GetUserDetailsDTO> getUser(@AuthenticationPrincipal AuthenticateUser authenticateUser) {

        UUID userId = authenticateUser.getUserId();

        return ResponseEntity.ok(userService.getUserByID(userId));
    }
}
