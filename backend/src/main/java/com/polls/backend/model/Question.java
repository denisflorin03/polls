package com.polls.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "question_type")
    private String questionType; // "single", "multiple", "text"

    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options;

    @ManyToOne
    @JoinColumn(name = "poll_id")
    private Poll poll;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // constructors
    public Question() {}

    public Question(String questionText, String questionType, List<String> options, Poll poll) {
        this.questionText = questionText;
        this.questionType = questionType;
        this.options = options;
        this.poll = poll;
        this.createdAt = LocalDateTime.now();
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public Poll getPoll() { return poll; }
    public void setPoll(Poll poll) { this.poll = poll; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}