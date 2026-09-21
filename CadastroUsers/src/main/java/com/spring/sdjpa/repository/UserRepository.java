package com.spring.sdjpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.sdjpa.domain.User;

public interface UserRepository extends JpaRepository<User, Integer>{

}
