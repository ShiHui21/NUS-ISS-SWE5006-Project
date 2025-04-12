package com.nusiss.service;

import com.nusiss.dto.UserCreateDTO;
import com.nusiss.dto.UserDTO;
import com.nusiss.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface UserService {
    ResponseEntity<String> registerUser(UserCreateDTO userCreateDTO);

    UserDTO getUser(UUID id);

}
