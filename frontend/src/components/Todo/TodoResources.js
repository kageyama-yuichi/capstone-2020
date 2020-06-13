import axios from 'axios'
import { JPA_URL } from '../../Constants'

class TodoResources {

    retrieve_todos(username) {
		return axios.get(`${JPA_URL}/dashboard/${username}`);
    }
	retrieve_todo(username, id) {
		return axios.get(`${JPA_URL}/dashboard/${username}/${id}`);
    }
	create_todo(username, todo) {
        return axios.post(`${JPA_URL}/dashboard/${username}/new`, todo);
    }
	update_todo(username, id, todo) {
        return axios.post(`${JPA_URL}/dashboard/${username}/${id}`, todo);
    }
    update_todo_status(username, id) {
        return axios.post(`${JPA_URL}/dashboard/${username}/${id}/status`)
    }
    delete_todo(username, id) {
        return axios.delete(`${JPA_URL}/dashboard/${username}/${id}`);
    }
    

}

export default new TodoResources()