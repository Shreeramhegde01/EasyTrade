package com.olx.controller;

import com.olx.dto.UpdateProfileRequest;
import com.olx.model.User;
import com.olx.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "phone", user.getPhone() != null ? user.getPhone() : "",
            "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user,
                                            @RequestBody UpdateProfileRequest request) {
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
        }
        try {
            User updated = userService.updateProfile(user, request);
            return ResponseEntity.ok(Map.of(
                "id", updated.getId(),
                "name", updated.getName(),
                "email", updated.getEmail(),
                "phone", updated.getPhone() != null ? updated.getPhone() : "",
                "createdAt", updated.getCreatedAt() != null ? updated.getCreatedAt().toString() : ""
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
