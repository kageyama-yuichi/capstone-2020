package com.l8z.autocomplete;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;

import org.json.simple.JSONObject;


public class PlacesService {
	private static final String PLACES_API_BASE = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";
	// Enter API key here to enable autocomplete
	// https://console.cloud.google.com/apis/credentials?project=l8z-project
	private static final String API_KEY = "";
	private static final String PLACE_TYPE = "address";
	private static final String PLACE_RADIUS = "5000";

	public static String autocomplete(String input, String sessionToken, String location) {

		HttpURLConnection conn = null;
		StringBuilder jsonResults = new StringBuilder();
		if (API_KEY == "") {
			return null;
		} else {
			
			try {
				StringBuilder sb = new StringBuilder(PLACES_API_BASE);
				sb.append("&sessiontoken=" + URLEncoder.encode(sessionToken, "utf8"));
				sb.append("&key=" + API_KEY);
				sb.append("&input=" + URLEncoder.encode(input, "utf8"));
				sb.append("&types=" + PLACE_TYPE);
				sb.append("&location=" + URLEncoder.encode(location, "utf8"));
				sb.append("&radius=" + PLACE_RADIUS);

				URL url = new URL(sb.toString());
				conn = (HttpURLConnection) url.openConnection();
				InputStreamReader in = new InputStreamReader(conn.getInputStream());

				int read;
				char[] buff = new char[1024];
				while ((read = in.read(buff)) != -1) {
					jsonResults.append(buff, 0, read);
				}
			} catch (MalformedURLException e) {
				System.err.println(e);
				return null;
			} catch (IOException e) {
				System.err.println(e);
				return null;
			} finally {
				if (conn != null) {
					conn.disconnect();
				}
			}
		}

		return jsonResults.toString();
	}

}
