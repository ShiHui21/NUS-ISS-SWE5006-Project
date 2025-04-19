package com.nusiss.service;

import com.nusiss.dto.UserCreateDTO;
import com.nusiss.dto.UserDTO;
import com.nusiss.dto.UserUpdateDTO;
import com.nusiss.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface UserService {
    ResponseEntity<String> registerUser(UserCreateDTO userCreateDTO);

    ResponseEntity<String> updateUser(UUID id, UserDTO userDTO);

    ResponseEntity<String> updatePassword(UUID id, String currentPassword, String newPassword);

    UserDTO getUserByID(UUID id);
}
