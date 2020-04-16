package com.l8z.resources;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldResource {
	@RequestMapping("/hello")
	public String firstPage() {
		return "Hello World";
	}
}