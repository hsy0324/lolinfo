import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
});

function mainData() {
	return instance.get('api/main');
}

function searchUser(userName) {
	return instance.get(`api/search/${encodeURIComponent(userName)}`);
}

function spectatorData(userName) {
	return instance.get(`api/search/${encodeURIComponent(userName)}/spectator`);
}

function matchData(userName) {
	return instance.get(`api/search/${encodeURIComponent(userName)}/match`);
}

export { mainData, searchUser, spectatorData, matchData };
