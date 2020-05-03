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
	retrieve_basic_users_in_orgs(members) {
		return axios.post(`${JPA_URL}/users/in/orgs`, members);
	}
	retrieve_pending_users_in_orgs(org_id) {
		return axios.post(`${JPA_URL}/users/pending/${org_id}`);
	}
	invite_to_org(inviter, invitee, org_id) {
		return axios.post(`${JPA_URL}/invite/orgs/${inviter}/${org_id}/${invitee}`);
	}
	invite_to_channel_org(inviter, invitee, org_id, channel_title) {
		return axios.post(`${JPA_URL}/invite/orgs/${inviter}/${org_id}/${channel_title}/${invitee}`);
	}
	remove_invited_user_from_org(remover, unique_id) {
		return axios.post(`${JPA_URL}/invite/removal/orgs/${remover}/${unique_id}`);
	}
	manage_users_in_org(org_id, body) {
		return axios.post(`${JPA_URL}/user/manage/orgs/${org_id}`, body);
	}
	remove_user_from_org(org_id, old_member) {
		return axios.post(`${JPA_URL}/user/remove/from/orgs/${org_id}`, old_member);
	}
	// Found in UserJpaResource
	retrieve_all_basic_users_by_name(name) {
		return axios.get(`${JPA_URL}/retrieve/user/${name}`);
	}
	retrieve_all_name_space() {
		return axios.get(`${JPA_URL}/retrieve/all/user/names`);
	}
	// Channel Related
	retrieve_all_channel_titles(username, org_id) {
		return axios.get(`${JPA_URL}/orgs/${username}/${org_id}/new`);
	}
	retrieve_channel(username, org_id, channel_title) {
		return axios.get(`${JPA_URL}/orgs/${username}/${org_id}/${channel_title}`);
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
	validateChannelTitle(username, org_id, old_channel_title, new_channel_title) {
		return axios.get(`${JPA_URL}/orgs/${username}/${org_id}/${old_channel_title}/${new_channel_title}`);
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
	add_users_to_channel(username, org_id, channel_title, added_members) {
		return axios.post(`${JPA_URL}/members/${username}/orgs/${org_id}/${channel_title}/add`, added_members)
	}
	remove_users_from_channel(username, org_id, channel_title, removed_members) {
		return axios.post(`${JPA_URL}/members/${username}/orgs/${org_id}/${channel_title}/remove`, removed_members)
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