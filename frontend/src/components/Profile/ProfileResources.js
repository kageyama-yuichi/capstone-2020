import axios from 'axios'
import { JPA_URL } from '../../Constants'

class ProfileResources {
    receiveUserProfile(username) {
		return axios.get(`${JPA_URL}/profile/${username}`);
    }
	updateUserProfile(username, prof) {
		return axios.post(`${JPA_URL}/profile/${username}`, prof);
	}
}

export default new ProfileResources()