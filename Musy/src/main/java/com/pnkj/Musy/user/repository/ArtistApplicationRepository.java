package com.pnkj.Musy.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pnkj.Musy.user.entity.ArtistApplications;

public interface ArtistApplicationRepository extends JpaRepository<ArtistApplications, Long> {

}
