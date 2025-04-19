package com.nusiss.service;
import com.nusiss.dto.UserCreateDTO;
import com.nusiss.entity.User;
import com.nusiss.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class RegisterService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    public RegisterService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<String> registerUser(UserCreateDTO userCreateDTO) {
        System.out.println("Inside registerUser method");

        if(!validationService.isUsernameValid(userCreateDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Username. Username should be 6 - 30 characters long and should not contain any special characters except '_'");
        }
        if(validationService.isUsernameTaken(userCreateDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already in use!");
        }

        if(!validationService.isEmailValid(userCreateDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid email format!");
        }

        if(validationService.isEmailTaken(userCreateDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
        }

//          User user = User.fromDTO(userCreateDTO);
        User user = new User();
        user.setUsername(userCreateDTO.getUsername());
        user.setPassword(userCreateDTO.getPassword());
        user.setName(userCreateDTO.getName());
        user.setEmail(userCreateDTO.getEmail());
        user.setMobileNumber(userCreateDTO.getMobileNumber());
        user.setLocation(userCreateDTO.getLocation());

        userRepository.save(user);
        System.out.println("User saved successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }
}
