import axios from 'axios'
import { JPA_URL } from '../../Constants'

class InvitesResources {
    retrieve_basic_user(usernames) {
		return axios.post(`${JPA_URL}/basic/users`, usernames);
	}
	retrieve_pending_invites_for_user(invitee) {
		return axios.get(`${JPA_URL}/user/${invitee}/pending/invites`);
	}
	// In OrgsResources
	user_decision_on_invite(unique_id, did_accept) {
		return axios.get(`${JPA_URL}/user/invite/orgs/${unique_id}/${did_accept}`);
	}
}

export default new InvitesResources()