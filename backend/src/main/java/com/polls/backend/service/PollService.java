package com.polls.backend.service;

import com.polls.backend.dto.CreatePollRequest;
import com.polls.backend.dto.PollDto;
import com.polls.backend.model.Poll;
import com.polls.backend.model.Question;
import com.polls.backend.model.User;
import com.polls.backend.repository.PollRepository;
import com.polls.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private UserRepository userRepository;

    public PollDto createPoll(CreatePollRequest request, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Poll poll = new Poll();
        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());
        poll.setUser(user);
        poll.setCreatedAt(LocalDateTime.now());

        // Create questions
        List<Question> questions = request.getQuestions().stream()
            .map(q -> {
                Question question = new Question();
                question.setQuestionText(q.getText());
                question.setQuestionType("single"); // Default to single choice
                question.setOptions(q.getOptions());
                question.setPoll(poll);
                return question;
            })
            .collect(Collectors.toList());

        poll.setQuestions(questions);

        Poll savedPoll = pollRepository.save(poll);
        return convertToDto(savedPoll);
    }

    public List<PollDto> getPollsByUserId(Long userId) {
        List<Poll> polls = pollRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return polls.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public Optional<PollDto> getPollById(Long pollId) {
        Optional<Poll> poll = pollRepository.findByIdWithQuestions(pollId);
        return poll.map(this::convertToDto);
    }

    public PollDto updatePoll(Long pollId, CreatePollRequest request, Long userId) {
        Poll poll = pollRepository.findById(pollId)
            .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only edit your own polls");
        }

        // Update poll fields
        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());

        // Clear existing questions and add new ones
        poll.getQuestions().clear();
        List<Question> questions = request.getQuestions().stream()
            .map(q -> {
                Question question = new Question();
                question.setQuestionText(q.getText());
                question.setQuestionType("single"); // Default to single choice
                question.setOptions(q.getOptions());
                question.setPoll(poll);
                return question;
            })
            .collect(Collectors.toList());

        poll.setQuestions(questions);

        Poll savedPoll = pollRepository.save(poll);
        return convertToDto(savedPoll);
    }

    public void deletePoll(Long pollId, Long userId) {
        Poll poll = pollRepository.findById(pollId)
            .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own polls");
        }

        pollRepository.delete(poll);
    }

    private PollDto convertToDto(Poll poll) {
        PollDto dto = new PollDto();
        dto.setId(poll.getId());
        dto.setTitle(poll.getTitle());
        dto.setDescription(poll.getDescription());
        dto.setUserId(poll.getUser().getId());
        dto.setUsername(poll.getUser().getUsername());
        dto.setCreatedAt(poll.getCreatedAt());

        // Convert questions
        List<PollDto.QuestionDto> questionDtos = poll.getQuestions().stream()
            .map(q -> {
                PollDto.QuestionDto questionDto = new PollDto.QuestionDto();
                questionDto.setId(q.getId());
                questionDto.setText(q.getQuestionText());
                questionDto.setOptions(q.getOptions());
                questionDto.setResponseCount(0); // TODO: Calculate actual response count
                return questionDto;
            })
            .collect(Collectors.toList());

        dto.setQuestions(questionDtos);
        dto.setTotalResponses(0); // TODO: Calculate actual total responses

        return dto;
    }
}
