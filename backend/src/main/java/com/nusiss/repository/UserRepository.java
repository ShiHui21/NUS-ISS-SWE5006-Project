package com.nusiss.repository;

import com.nusiss.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findUserByUsername(String username);
    Optional<User> findUserByEmail(String username);
    Optional<User> getUserById(UUID id);
    Optional<User> getUserByUsername(String username);

}
