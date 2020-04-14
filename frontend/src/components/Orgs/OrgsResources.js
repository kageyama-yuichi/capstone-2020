import axios from 'axios'
import { JPA_URL } from '../../Constants'

class OrgsResources {

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
}

export default new OrgsResources()