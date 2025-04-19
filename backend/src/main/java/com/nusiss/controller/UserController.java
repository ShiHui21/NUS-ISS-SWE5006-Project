package com.nusiss.controller;

import com.nusiss.dto.PasswordChangeDTO;
import com.nusiss.dto.UserCreateDTO;
import com.nusiss.dto.UserDTO;
import com.nusiss.dto.UserUpdateDTO;
import com.nusiss.service.PasswordService;
import com.nusiss.service.RegisterService;
import com.nusiss.service.UserDetailService;
import com.nusiss.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import javax.naming.Binding;
import java.util.UUID;

@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordService passwordService;
    @Autowired
    private RegisterService registerService;
    @Autowired
    private UserDetailService userDetailService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid UserCreateDTO userCreateDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }

        return registerService.registerUser(userCreateDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable UUID id, @RequestBody @Valid UserUpdateDTO userUpdateDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }

        return userDetailService.updateUser(id, userUpdateDTO);
    }

    @PutMapping("/update/password/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable UUID id, @RequestBody @Valid PasswordChangeDTO passwordChangeDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }

        return passwordService.updatePassword(id, passwordChangeDTO.getCurrentPassword(), passwordChangeDTO.getNewPassword());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userDetailService.getUserByID(id));
    }
}
