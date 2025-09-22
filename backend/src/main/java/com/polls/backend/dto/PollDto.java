package com.polls.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PollDto {
    private Long id;
    private String title;
    private String description;
    private Long userId;
    private String username;
    private List<QuestionDto> questions;
    private LocalDateTime createdAt;
    private int totalResponses;

    // constructors
    public PollDto() {}

    public PollDto(Long id, String title, String description, Long userId, String username, 
                   List<QuestionDto> questions, LocalDateTime createdAt, int totalResponses) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.username = username;
        this.questions = questions;
        this.createdAt = createdAt;
        this.totalResponses = totalResponses;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public List<QuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDto> questions) { this.questions = questions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getTotalResponses() { return totalResponses; }
    public void setTotalResponses(int totalResponses) { this.totalResponses = totalResponses; }

    public static class QuestionDto {
        private Long id;
        private String text;
        private List<String> options;
        private int responseCount;

        // constructors
        public QuestionDto() {}

        public QuestionDto(Long id, String text, List<String> options, int responseCount) {
            this.id = id;
            this.text = text;
            this.options = options;
            this.responseCount = responseCount;
        }

        // getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public int getResponseCount() { return responseCount; }
        public void setResponseCount(int responseCount) { this.responseCount = responseCount; }
    }
}
