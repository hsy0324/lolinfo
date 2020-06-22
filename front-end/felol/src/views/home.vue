<template>
	<div class="container">
		<div class="center">
			<img
				src="../../public/lolinfologo.png"
				alt="logo"
				width="300,"
				height="300"
			/>
		</div>
		<div class="center2">
			<form>
				<input type="text" v-model="search" placeholder="Search" autofocus />
				<button v-show="search.length" @click.prevent="searchUser">
					Search
				</button>
			</form>
		</div>
		<div id="nav">
			<ul class="lot">
				금주의 로테이션 챔피언
				<li
					v-for="(item, index) in this.$store.getters.lotationChampList"
					:key="index"
				>
					<img :src="item" alt="챔피언" width="50," height="50" />
				</li>
			</ul>
		</div>
		<div>
			<ul>
				초보자 추천 리스트
				<li
					v-for="(item, index) in this.$store.getters.begChampList"
					:key="index"
				>
					<img :src="item" alt="" width="50," height="50" />
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mainData, searchUser, spectatorData, matchData } from '../api/index';
export default {
	data() {
		return {
			search: '',
		};
	},
	created() {
		this.fetchdata();
	},
	methods: {
		async searchUser() {
			try {
				const userId = this.search;
				const response = await searchUser(userId);
				console.log(response.data);
				if (response.status == 200) {
					const response2 = await spectatorData(userId);
					console.log(response2.data);
					const response3 = await matchData(userId);
					console.log(response3.data);
					this.$store.commit('setSpectTator', response2.data);
					this.$store.commit('setMatchData', response3.data);
				}
			} catch (error) {
				console.log('에러');
			}
		},
		async fetchdata() {
			try {
				const response = await mainData();
				this.$store.commit('setlotationChamp', response.data.c_rotation);
				this.$store.commit('setbegChamp', response.data.c_rotation_newbie);
				console.log(response.data);
			} catch (error) {
				console.log('에러');
			}
		},
	},
};
</script>

<style scoped>
.center {
	width: 100vw;
	height: 50vh;
	font-weight: bolder;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.center2 {
	width: 100vw;
	height: 2vh;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.lot {
	float: left;
}
</style>
