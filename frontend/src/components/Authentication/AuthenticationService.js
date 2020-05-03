import axios from 'axios'
import { API_URL } from '../../Constants'

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const TOKEN = 'token'

class AuthenticationService {

    // Authenticate a given username and password through JWT
    executeJwtAuthenticationService(username, password) {
        return axios.post(`${API_URL}/authenticate`, {
            username,
            password
        })
    }

    // Check if User Already Exists
    checkForUser(username) {
        return axios.post(`${API_URL}/register-check`, {username})
    }

    // If User Doesn't Exist in Database, Register Them
    registerNewUser(user) {
        return axios.post(`${API_URL}`, user)
    }

    //Set up state variables and axios interceptors if a login succeeds
    registerSuccessfulLoginForJwt(username, token) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
		sessionStorage.setItem(TOKEN, this.createJWTToken(token))
        this.setupAxiosInterceptors(this.createJWTToken(token))
    }

    //Append JWT token string appropriately for backend use
    createJWTToken(token) {
        return 'Bearer ' + token
    }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return false
        return true
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user
    }

    //Set axios request headers to correct JWT token so user's requests are
    //authenticated
    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }
}

export default new AuthenticationService()
