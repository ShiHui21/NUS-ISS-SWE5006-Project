package com.nusiss.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginDTO {


    @NotBlank(message = "Identifier (username or email) is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;

    public String getIdentifier() { return identifier; }
    public String getPassword() { return password; }
}
