package com.pnkj.Musy.history.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pnkj.Musy.history.entity.PlayHistory;

public interface PlayHistoryRepository extends JpaRepository<PlayHistory, Long> {
    List<PlayHistory> findAllByUserUserId(Long userId);

}
