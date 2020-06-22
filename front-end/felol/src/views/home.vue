<template>
	<div class="container">
		<img src="../../public/lolinfologo.png" alt="logo" align="center" />
		<form>
			<input
				type="text"
				v-model="search"
				placeholder="Search"
				autofocus
				align="center"
			/>
			<button v-show="search.length" @click="serachUser">
				Search
			</button>
		</form>
	</div>
</template>

<script>
import { searchU } from '../api/index';
export default {
	data() {
		return {
			search: '',
		};
	},
	methods: {
		async searchUser() {
			try {
				const userId = this.search;
				const response = await searchU(userId);
				console.log(response);
			} catch (error) {
				console.log('에러');
			}
		},
	},
};
</script>

<style></style>
