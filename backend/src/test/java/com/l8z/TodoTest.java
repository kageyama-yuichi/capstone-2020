package com.l8z;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.l8z.todos.OrgTodo;
import com.l8z.todos.Todo;

class TodoTest {
	
	Todo todo = new Todo();
	
	@BeforeEach
	void setup() {
		
		//Creating a new todo under V
		todo.set_username("V");
		
		//Its description
		todo.set_desc("Very nice");
		
		//Setting the date
		todo.set_date("12/08/2020");
		
		//its status should be false
		todo.set_status(false);
	}
	

	@Test
	public void ToDoCheckTest()
	{
		
		assertEquals(todo.get_username(), "V");
		assertEquals(todo.get_desc(), "Very nice");
		assertEquals(todo.get_date(), "12/08/2020");
		assertEquals(todo.get_status(), false);
	}
	
	@Test
	public void EditToDo() //test to see if changing todos work
	{
		//Editing status desc and date test
		
		todo.set_status(true);
		
		todo.set_desc("Very nice is very nice");
		
		todo.set_date("12/08/2020");
		
		assertEquals(todo.get_status(), true);
		assertEquals(todo.get_desc(), "Very nice is very nice");
		assertEquals(todo.get_date(), "12/08/2020");
	}
	
	@Test
	public void orgsToDoCreate() //Test for current org title and updating
	{
		
		OrgTodo orgstodo = new OrgTodo("RMITL8Z", "Testers", null, null, null, false);
	
				String desc = "Do Backend Testing";
				orgstodo.set_desc(desc);
				
				String date = "6/6/2069";
				orgstodo.set_date(date);
				
				assertEquals(orgstodo.getOrgId(), "RMITL8Z");
				assertEquals(orgstodo.getOrgChannel(), "Testers");
				assertEquals(orgstodo.get_desc(), "Do Backend Testing");
				assertEquals(orgstodo.get_date(), "6/6/2069");
				assertEquals(orgstodo.get_status(), false);
	}

}
