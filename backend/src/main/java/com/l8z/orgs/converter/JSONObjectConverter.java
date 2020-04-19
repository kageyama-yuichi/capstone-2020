package com.l8z.orgs.converter;
//Sourced from: https://ilhicas.com/2019/04/26/Persisting-JSONObject-Using-JPA.html
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

@Converter
public class JSONObjectConverter implements AttributeConverter<JSONObject, String> {
    @Override
    public String convertToDatabaseColumn(JSONObject data) {
        String json;
        try {
            json = data.toString();
        }
        catch (NullPointerException ex) {
            //extend error handling here if you want
            json = "";
        }
        return json;
    }

    @Override
    public JSONObject convertToEntityAttribute(String data_as_json) {
        JSONObject json_data = new JSONObject();
        JSONParser parser = new JSONParser();
        
        try {
        	json_data = (JSONObject) parser.parse(data_as_json);
    
        } catch (Exception ex) {
            //extend error handling here if you want
        	json_data = null;
        }
        return json_data;
    }
}