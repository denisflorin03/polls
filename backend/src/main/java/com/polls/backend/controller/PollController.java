package com.polls.backend.controller;

import com.polls.backend.dto.CreatePollRequest;
import com.polls.backend.dto.PollDto;
import com.polls.backend.service.PollService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/polls")
@CrossOrigin(origins = "http://localhost:3000")
public class PollController {

    @Autowired
    private PollService pollService;

    @PostMapping
    public ResponseEntity<PollDto> createPoll(@Valid @RequestBody CreatePollRequest request) {
        // TODO: Get user ID from JWT token
        Long userId = 1L; // For now, hardcoded to user ID 1 (denis)
        
        PollDto poll = pollService.createPoll(request, userId);
        return ResponseEntity.ok(poll);
    }

    @GetMapping("/my-polls")
    public ResponseEntity<List<PollDto>> getMyPolls() {
        // TODO: Get user ID from JWT token
        Long userId = 1L; // For now, hardcoded to user ID 1 (denis)
        
        List<PollDto> polls = pollService.getPollsByUserId(userId);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PollDto> getPoll(@PathVariable Long id) {
        return pollService.getPollById(id)
            .map(poll -> ResponseEntity.ok(poll))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PollDto> updatePoll(@PathVariable Long id, @Valid @RequestBody CreatePollRequest request) {
        // TODO: Get user ID from JWT token
        Long userId = 1L; // For now, hardcoded to user ID 1 (denis)
        
        try {
            PollDto poll = pollService.updatePoll(id, request, userId);
            return ResponseEntity.ok(poll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoll(@PathVariable Long id) {
        // TODO: Get user ID from JWT token
        Long userId = 1L; // For now, hardcoded to user ID 1 (denis)
        
        try {
            pollService.deletePoll(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
