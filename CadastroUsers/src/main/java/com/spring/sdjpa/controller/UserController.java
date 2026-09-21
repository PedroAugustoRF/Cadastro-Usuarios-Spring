package com.spring.sdjpa.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.sdjpa.domain.User;
import com.spring.sdjpa.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService service;
	
	@PostMapping
	public User save(@RequestBody User user) {
		return service.save(user);
	}
	
	@GetMapping("/{id}")
	public Optional<User> findById(@PathVariable Integer id) {
		return service.findById(id);
	}
	
	@GetMapping
	public List<User> findAll() {
		return service.findAll();
	}
	
	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable Integer id) {
		service.deleteById(id);
	}
}
