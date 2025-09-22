package com.polls.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreatePollRequest {
    @NotBlank(message = "Poll title is required")
    @Size(max = 255, message = "Poll title must not exceed 255 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotEmpty(message = "At least one question is required")
    private List<QuestionRequest> questions;

    // constructors
    public CreatePollRequest() {}

    public CreatePollRequest(String title, String description, List<QuestionRequest> questions) {
        this.title = title;
        this.description = description;
        this.questions = questions;
    }

    // getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<QuestionRequest> getQuestions() { return questions; }
    public void setQuestions(List<QuestionRequest> questions) { this.questions = questions; }

    public static class QuestionRequest {
        @NotBlank(message = "Question text is required")
        @Size(max = 500, message = "Question text must not exceed 500 characters")
        private String text;

        @NotEmpty(message = "At least two options are required")
        @Size(min = 2, message = "At least two options are required")
        private List<String> options;

        // constructors
        public QuestionRequest() {}

        public QuestionRequest(String text, List<String> options) {
            this.text = text;
            this.options = options;
        }

        // getters and setters
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }
    }
}
