package com.l8z.autocomplete;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class PlacesController {

	PlacesService placesService = new PlacesService();	
	
	@GetMapping("/jpa/places/suggestions/{input}/{sessionToken}/{location}")
	public ResponseEntity<String> getSuggestions(@PathVariable String input, @PathVariable String sessionToken, @PathVariable String location){

		String retList = placesService.autocomplete(input, sessionToken, location);
		
		if(retList == null) {
			return new ResponseEntity<String>(retList, HttpStatus.INTERNAL_SERVER_ERROR);
		}else {
			return new ResponseEntity<String>(retList, HttpStatus.OK);

		}
		
		
	}
	
}
