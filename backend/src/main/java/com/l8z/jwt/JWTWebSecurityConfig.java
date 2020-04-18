package com.l8z.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class JWTWebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private JwtUnAuthorizedResponseAuthenticationEntryPoint jwtUnAuth;

	@Autowired
	private UserDetailsService jwtUserService;

	@Autowired
	private JwtTokenAuthorizationOncePerRequestFilter jwtAuthenticationTokenFilter;

	@Value("${jwt.get.token.uri}")
	private String authenticationPath;

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth
		.userDetailsService(jwtUserService)
		.passwordEncoder(passwordEncoderBean());
	}

	@Bean
	public PasswordEncoder passwordEncoderBean() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		// Disable CSRF (cross site request forgery)
		.csrf().disable().exceptionHandling().authenticationEntryPoint(jwtUnAuth)
		.and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		// Allow Anyone (including unauthorised Members) access "/" and register-check
		.and().authorizeRequests().antMatchers("/", "register-check").permitAll()
		// This means to access anything else, the User must be Logged In
		.anyRequest().authenticated().and().cors()
		.and().requestMatchers().antMatchers("/jpa/**");

		http
		.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

		http
		.headers()
		.frameOptions().sameOrigin()  //H2 Console Needs this setting
		.cacheControl(); //disable caching

	}

	@Override
	public void configure(WebSecurity webSecurity) throws Exception {
		webSecurity
		.ignoring().antMatchers(HttpMethod.POST, authenticationPath)
		// Anything going to /jpa/** is ignored by the Security
		.and().ignoring().antMatchers("/jpa/**")
		.and().ignoring().antMatchers("/h2-console/**/**");//Should not be in Production!

	}
}

