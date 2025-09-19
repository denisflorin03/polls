package com.polls.backend.service;

import com.polls.backend.dto.*;
import com.polls.backend.model.User;
import com.polls.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email already exists");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            User savedUser = userRepository.save(user);
            UserDto userDto = new UserDto(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
            return new AuthResponse(true, "User registered successfully", null, userDto);
        } catch (Exception e) {
            return new AuthResponse(false, "Registration failed: " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return new AuthResponse(false, "Invalid email or password");
        }

        User user = userOptional.get();
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid email or password");
        }

        // For now, we'll return a simple success response
        // In a real application, you would generate a JWT token here
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail());
        return new AuthResponse(true, "Login successful", "dummy-token", userDto);
    }

    public UserDto getCurrentUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return null;
        }

        User user = userOptional.get();
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }
}
