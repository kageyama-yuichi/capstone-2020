import axios from 'axios'
import { JPA_URL } from '../../Constants'

class OrgsResources {

    retrieve_orgs(username) {
	return axios.get(`${JPA_URL}/orgs/${username}`);
    }
	create_org(username, org) {
        return axios.post(`${JPA_URL}/orgs/${username}`, org);
    }
	/*
    delete_org(username, org_id) {
        return axios.delete(`${JPA_URL}/orgs/${username}/${org_id}`);
    }
    update_org(username, org_id, org) {
        return axios.put(`${JPA_URL}/orgs/${username}/${org_id}`, org);
    }
    retrieve_org(username, org_id) {
        return axios.get(`${JPA_URL}/orgs/${username}/${org_id}`);
    }
	*/
}

export default new OrgsResources()