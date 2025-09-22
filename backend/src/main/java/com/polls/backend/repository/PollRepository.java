package com.polls.backend.repository;

import com.polls.backend.model.Poll;
import com.polls.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    
    // Find all polls by user
    List<Poll> findByUserOrderByCreatedAtDesc(User user);
    
    // Find all polls by user ID
    List<Poll> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find poll by ID with questions
    @Query("SELECT p FROM Poll p LEFT JOIN FETCH p.questions WHERE p.id = :id")
    Optional<Poll> findByIdWithQuestions(@Param("id") Long id);
    
    // Count total responses for a poll
    @Query("SELECT COUNT(a) FROM Answer a JOIN a.question q WHERE q.poll.id = :pollId")
    Long countTotalResponsesByPollId(@Param("pollId") Long pollId);
}
