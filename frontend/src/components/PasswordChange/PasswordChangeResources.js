import axios from 'axios'
import { JPA_URL } from '../../Constants'

class PasswordChangeResources {
    receiveUserPassword(username, password) {
		return axios.get(`${JPA_URL}/profile/${username}/`, password);
    }
	updateUserPassword(username, password){
			return axios.post(`${JPA_URL}/profile/${username}/${password}`, password);
	} 
}

export default new PasswordChangeResources()