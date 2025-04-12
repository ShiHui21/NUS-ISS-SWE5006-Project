package com.nusiss.service;

import com.nusiss.dto.UserCreateDTO;
import com.nusiss.dto.UserDTO;
import com.nusiss.entity.User;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<String> registerUser(UserCreateDTO userCreateDTO) {
        Optional<User> userOpt = userRepository.findUserByUsername(userCreateDTO.getUsername());
        if(userOpt.isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
        }
        else {
            User user = User.fromDTO(userCreateDTO);
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        }
    }

    @Override
    public UserDTO getUser(UUID id) {
        User user = userRepository.findUserByID(id).orElseThrow(() -> new UserNotFoundException(id));
            return new UserDTO(user);
    }
}
