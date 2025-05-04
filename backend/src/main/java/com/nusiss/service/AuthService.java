package com.nusiss.service;

import com.nusiss.dto.CreateUserDTO;
import com.nusiss.entity.User;
import com.nusiss.enums.Region;
import com.nusiss.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ValidationService validationService;

    public AuthService(UserRepository userRepository, ValidationService validationService) {

        this.userRepository = userRepository;
        this.validationService = validationService;
    }

    public ResponseEntity<String> createUser(CreateUserDTO createUserDTO) {
        System.out.println("Inside createUser method");

        if(!validationService.isUsernameValid(createUserDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Username. Username should be 6 - 30 characters long and should not contain any special characters except '_'");
        }
        if(validationService.isUsernameTaken(createUserDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
        }

        if(!validationService.isEmailValid(createUserDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid email format!");
        }

        if(validationService.isEmailTaken(createUserDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
        }

//          User user = User.fromDTO(userCreateDTO);
        User user = new User();
        user.setUsername(createUserDTO.getUsername());
        user.setPassword(createUserDTO.getPassword());
        user.setName(createUserDTO.getName());
        user.setEmail(createUserDTO.getEmail());
        user.setMobileNumber(createUserDTO.getMobileNumber());
        user.setRegion(Region.fromRegionDisplayName(createUserDTO.getRegion()));

        userRepository.save(user);
        System.out.println("User created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully!");
    }
}
