package com.nusiss.entity;

import com.nusiss.dto.UserCreateDTO;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class User {
    @Id @GeneratedValue
    private UUID id;

    private String username;
    private String password;
    private String name;
    private String email;
    private String mobileNumber;
    private String location;

    public static User fromDTO(UserCreateDTO dto) {
        User user = new User();
        user.username = dto.getUsername();
        user.password = dto.getPassword();
        user.name = dto.getName();
        user.email = dto.getEmail();
        user.mobileNumber = dto.getMobileNumber();
        user.location = dto.getLocation();
        return user;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLocation() {
        return this.location;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getMobileNumber() {
        return this.mobileNumber;
    }

}
