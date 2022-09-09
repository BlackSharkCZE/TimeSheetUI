<template>
	<div class="todoForm">
		<div class="flexItem">Todo:</div>
		<div class="flexItem grow">
			<input type="text" class="bs-input" v-model="item"/>
		</div>
		<div class="flexItem">
			<div>
				<input type="button" class="bs-button success" @click="create" value="Create!"/>
			</div>
		</div>
	</div>
</template>

<script>

import { TimesheetGraph } from '@/services/TimesheetGraph'

export default {
	name: 'TodoForm',
	emits: ['ItemCreated'],
	data() {
		return {
			item: null
		}
	},
	computed: {},
	mounted() {

	},
	methods: {
		create() {
			TimesheetGraph.todo.save({ todo: this.item }).then(data => {
				this.$emit('ItemCreated', data.data.createTodo)
			}).catch(e => {
				console.error('Can not create todo!', e)
			})
		}
	}
}
</script>

<style scoped lang="scss">

.todoForm {
	color: $primary;
	border-bottom: 1px solid $bs-table-color;
	display: flex;
	align-items: flex-start;
	flex-direction: row;

	.flexItem {
		&.grow {
			flex-grow: 1;
		}

		text-align: left;
		flex-grow: 0;
		padding: 0 1rem
	}
}

</style>
