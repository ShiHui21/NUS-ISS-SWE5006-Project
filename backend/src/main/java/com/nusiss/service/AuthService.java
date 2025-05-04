package com.nusiss.service;

import com.nusiss.dto.CreateUserDTO;
import com.nusiss.entity.User;
import com.nusiss.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
//    private final ValidationService validationService;

    public AuthService(UserRepository userRepository, ValidationService validationService) {

        this.userRepository = userRepository;
//        this.validationService = validationService;
    }

    public ResponseEntity<?> createUser(CreateUserDTO createUserDTO) {
        System.out.println("Inside createUser method");
        // Map<String, String> errors = new HashMap<>();

        // if(!validationService.isUsernameValid(createUserDTO.getUsername())) {
        //     errors.put("username", "Username must be 6–30 characters and contain only letters, numbers, and underscores.");
        // } else if(validationService.isUsernameTaken(createUserDTO.getUsername())) {
        //     errors.put("username", "Username is already in use.");
        // }

        // if (!validationService.isEmailValid(createUserDTO.getEmail())) {
        //     errors.put("email", "Invalid email format.");
        // } else if (validationService.isEmailTaken(createUserDTO.getEmail())) {
        //     errors.put("email", "Email is already in use.");
        // }

        // if (!errors.isEmpty()) {
        //     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        // }

//          User user = User.fromDTO(userCreateDTO);
        User user = new User();
        user.setUsername(createUserDTO.getUsername());
        user.setPassword(createUserDTO.getPassword());
        user.setName(createUserDTO.getName());
        user.setEmail(createUserDTO.getEmail());
        user.setMobileNumber(createUserDTO.getMobileNumber());
        user.setLocation(createUserDTO.getLocation());

        userRepository.save(user);
        System.out.println("User created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully!");
    }
}