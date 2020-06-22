import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		lotationChamp: [],
		begChamp: [],
		spectator: [],
		matchdata: [],
	},
	mutations: {
		setlotationChamp(state, champ) {
			state.lotationChamp = champ;
		},
		setbegChamp(state, beC) {
			state.begChamp = beC;
		},
		setSpecTator(state, spec) {
			state.spectator = spec;
		},
		setMatchData(state, matc) {
			state.matchdata = matc;
		},
	},
	actions: {},
	modules: {},
	getters: {
		lotationChampList(state) {
			return state.lotationChamp;
		},
		begChampList(state) {
			return state.begChamp;
		},
		spectatorList(state) {
			return state.spectator;
		},
		matchdataList(state) {
			return state.matchdata;
		},
	},
});
