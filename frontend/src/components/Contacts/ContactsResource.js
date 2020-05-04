import axios from 'axios'
import { JPA_URL } from '../../Constants'

class ContactsResource {
    
    addContact(username, target) {
        return axios.post(`${JPA_URL}/private/contacts/${username}/${target}`);
    }

    getContactList(username) {
        return axios.get(`${JPA_URL}/private/contacts/${username}/new`);
    }

    remove_contact(username_1, username_2) {
        return axios.delete(`${JPA_URL}/private/contacts/${username_1}/${username_2}`);
    }

    changeContactStatus(username, target) {
        return axios.post(`${JPA_URL}/private/contacts/${username}/${target}/status`);
    }

    getContact(username, target) {
        return axios.get(`${JPA_URL}/private/contacts/${username}/${target}`);
    }

}
export default new ContactsResource()