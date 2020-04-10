import axios from 'axios'
import { JPA_URL } from '../../Constants'

class OrgsResources {
    // Organisation Related
	retrieve_orgs(username) {
		return axios.get(`${JPA_URL}/orgs/${username}`);
    }
	retrieve_org(username, org_id) {
		return axios.get(`${JPA_URL}/orgs/${username}/${org_id}`);
    }
	retrieve_all_orgs(username) {
		return axios.get(`${JPA_URL}/orgs/${username}/new`);
    }
	create_org(username, org) {
        return axios.post(`${JPA_URL}/orgs/${username}/new`, org);
    }
	update_org(username, org_id, org) {
        return axios.post(`${JPA_URL}/orgs/${username}/${org_id}`, org);
    }
    delete_org(username, org_id) {
        return axios.delete(`${JPA_URL}/orgs/${username}/${org_id}`);
    }
	// Channel Related
	retrieve_all_channel_titles(username, org_id) {
		return axios.get(`${JPA_URL}/orgs/${username}/${org_id}/new`);
	}
	create_channel(username, org_id, channel) {
		return axios.post(`${JPA_URL}/orgs/${username}/${org_id}/new`, channel);
	}
	update_channel(username, org_id, channel_title, channel) {
        return axios.post(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}`, channel);
    }
	delete_channel(username, org_id, channel_title) {
        return axios.delete(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}`);
    }
}

export default new OrgsResources()