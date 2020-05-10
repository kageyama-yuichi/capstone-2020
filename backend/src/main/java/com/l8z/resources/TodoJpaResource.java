package com.l8z.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.TodoJpaRepository;
import com.l8z.todos.Todo;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController
public class TodoJpaResource {
	@Autowired
	private TodoJpaRepository todojpa;
	
	@GetMapping("/jpa/dashboard/{username}")
	public List<Todo> retrieve_todos(@PathVariable String username){
		return todojpa.findByUsername(username);
	}

	@GetMapping("/jpa/dashboard/{username}/{id}")
	public Todo retrieve_todo(@PathVariable String username, @PathVariable long id){
		return todojpa.findById(id).get();
	}

	@PostMapping("/jpa/dashboard/{username}/new")
	public ResponseEntity<Void> create_todo(
			@PathVariable String username, 
			@RequestBody Todo todo
		){
		todo.set_username(username);
		todojpa.save(todo);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/jpa/dashboard/{username}/{id}")
	public ResponseEntity<Void> delete_todo(@PathVariable String username, @PathVariable long id) {
		todojpa.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/jpa/dashboard/{username}/{id}/status")
	public ResponseEntity<Void> update_todo_status(@PathVariable String username, @PathVariable long id) {
		Todo todoToUpdate = todojpa.getOne(id);
		todoToUpdate.set_status(!todoToUpdate.get_status());
		todojpa.save(todoToUpdate);
		return ResponseEntity.noContent().build();
	}
	
	
	@PostMapping("/jpa/dashboard/{username}/{id}")
	public ResponseEntity<Void> update_todo(
			@PathVariable String username,
			@PathVariable long id, 
			@RequestBody Todo todo
		){
		Todo todoToUpdate = todojpa.getOne(id);
		todoToUpdate.set_date(todo.get_date());
		todoToUpdate.set_desc(todo.get_desc()); 
		todoToUpdate.set_color(todo.get_color());

		todojpa.save(todoToUpdate);
		return ResponseEntity.noContent().build();
	}
}
