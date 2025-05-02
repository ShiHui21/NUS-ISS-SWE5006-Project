package com.nusiss.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdatePasswordDTO {

    @NotBlank(message = "Current password is required")
    String currentPassword;

    @NotBlank(message = "New password is required")
    String newPassword;

    public UpdatePasswordDTO(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getCurrentPassword() { return currentPassword; }

    public String getNewPassword() {
        return newPassword;
    }
}
