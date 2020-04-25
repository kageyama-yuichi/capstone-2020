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
	// Channel Todo Related
	retrieve_org_todos(username, org_id, channel_title) {
		return axios.get(`${JPA_URL}/orgs/todos/${username}/${org_id}/${channel_title}`);
	}
	retrieve_org_todo(username, org_id, channel_title, id) {
		return axios.get(`${JPA_URL}/orgs/todos/${username}/${org_id}/${channel_title}/${id}`);
    }
	create_org_todo(username, org_id, channel_title, todo) {
        return axios.post(`${JPA_URL}/orgs/todos/${username}/${org_id}/${channel_title}/new`, todo);
    }
	update_org_todo(username, org_id, channel_title, id, todo) {
        return axios.post(`${JPA_URL}/orgs/todos/${username}/${org_id}/${channel_title}/${id}`, todo);
    }
    update_org_todo_status(username, org_id, channel_title, id) {
        return axios.post(`${JPA_URL}/orgs/todos/${username}/${org_id}/${channel_title}/${id}/status`)
    }
    delete_org_todo(username, org_id, channel_title, id) {
        return axios.delete(`${JPA_URL}/orgs/todos/${username}/${org_id}/${channel_title}/${id}`);
    }
	// Instance Related
	retrieve_all_instance_titles(username, org_id, channel_title) {
	return axios.get(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}/new`);
	}
	create_instance(username, org_id, channel_title, instance) {
		return axios.post(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}/new`, instance);
	}
	update_instance(username, org_id, channel_title, instance_title, instance) {
	return axios.post(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}/${instance_title}`, instance);
    }
	delete_instance(username, org_id, channel_title, instance_title) {
        return axios.delete(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}/${instance_title}`);
    }
}

export default new OrgsResources()