package com.nusiss.entity;

import com.nusiss.util.PasswordUtil;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class User {
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @GeneratedValue
    private UUID id;

    private String username;
    private String password;
    private String name;
    private String email;
    private String mobileNumber;
    private String location;

    @Version
    private int version;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdOn;

    @PrePersist
    public void prePersist() {
        if (createdOn == null) {
            createdOn = LocalDateTime.now();
        }
    }

    public UUID getId() { return this.id; }

    public void setId(UUID id) { this.id = id; }

    public void setUsername(String username) { this.username = username; }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) { this.password = PasswordUtil.hashPassword((password)); }

    public String getPassword() { return this.password; }

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
