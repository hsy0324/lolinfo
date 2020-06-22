import axios from 'axios';

function searchU(userid) {
	return axios.get(userid);
}

export { searchU };
