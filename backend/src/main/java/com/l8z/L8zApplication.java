package com.l8z;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class L8zApplication {

	@PostConstruct
    public void init(){
        TimeZone.setDefault(TimeZone.getTimeZone("Australia/NSW"));   
    }
	
	public static void main(String[] args) {
		SpringApplication.run(L8zApplication.class, args);
	}

}
