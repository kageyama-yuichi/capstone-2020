import axios from 'axios'
import { JPA_URL } from '../../Constants'

class RegisterResources {
    // Register Related
	registerUser(username, user) {
		return axios.post(`${JPA_URL}/register/${username}`, user);
    }
}

export default new RegisterResources()