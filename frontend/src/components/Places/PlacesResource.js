import axios from 'axios'
import { JPA_URL } from '../../Constants'

class PlacesResource {
    getSuggestions(input, sessionToken, location) {
	  	return axios.get(`${JPA_URL}/places/suggestions/${input}/${sessionToken}/${location}`);
    }

}

export default new PlacesResource()