import axios from 'axios'
import { JPA_URL } from '../../Constants'

class PasswordRecoveryResources {
    sendTokenForResetPassword(email) {
		return axios.post(`${JPA_URL}/user/password/reset/${email}`);
	}
	checkPasswordResetToken(token) {
		return axios.post(`${JPA_URL}/check/password/reset/token/${token}`);
	}
	updateUserPassword(username, password, token) {
		return axios.post(`${JPA_URL}/profile/${username}/${password}/${token}`);
	}
}

export default new PasswordRecoveryResources()