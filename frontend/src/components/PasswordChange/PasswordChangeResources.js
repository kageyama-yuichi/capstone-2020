import axios from 'axios'
import { JPA_URL } from '../../Constants'

class PasswordChangeResources {
	updateUserPassword(username, password, token) {
		return axios.post(`${JPA_URL}/profile/${username}/${password}/${token}`);
	} 
}

export default new PasswordChangeResources()