package com.spring.sdjpa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.spring.sdjpa.domain.User;
import com.spring.sdjpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository repository;
	
	public User save(User user) {
		return repository.save(user);
	}
	
	public Optional<User> findById(Integer id) {
		return repository.findById(id);
	}
	
	public List<User> findAll() {
		return repository.findAll();
	}
	
	public void deleteById(Integer id) {
		repository.deleteById(id);
	}
	
	
}
