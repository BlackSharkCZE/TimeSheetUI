<template>
	<div class="todoItem" :class="{'done': value.done}">
		<div class="flexItem">{{ value.id }}</div>
		<div class="flexItem grow" :class="{'done': value.done}">{{ value.todo }}</div>
		<div class="flexItem">
			<div class="done" v-show="value.done">
				{{ value.done | asTimestamp }}
				|
				<input type="button" class="bs-button danger" @click="deleteItem(value)" value="Delete"/>
			</div>
			<div class="working" v-show="!value.done">
				<input type="button" class="bs-button success" @click="markDone(value)" value="Mark Done!"/>
			</div>
		</div>
	</div>
</template>

<script>

import { TimesheetGraph } from '@/services/TimesheetGraph'

export default {
	name: 'TodoItem',
	emits: ['ItemDone'],
	props: {
		value: {
			type: Object,
			required: true
		}
	},
	data() {
		return {}
	},
	computed: {},
	mounted() {

	},
	methods: {
		markDone(item) {
			TimesheetGraph.todo.markDone(item.id).then(data => {
				this.$emit('input', data.data.markDone)
			})
		},
		deleteItem(item) {
			TimesheetGraph.todo.delete(item.id).then(data => {
				this.$emit('ItemDeleted', data.data.delete)
			})
		}
	}
}
</script>

<style scoped lang="scss">

.todoItem {
	color: $primary;
	border-bottom: 1px solid $bs-table-color;
	display: flex;
	align-items: flex-start;
	flex-direction: row;

	&.done {
		color: $bs-table-color;
	}

	.flexItem {
		&.grow {
			flex-grow: 1;
		}

		&.done {
			text-decoration: line-through;
			color: $bs-table-color;
		}

		text-align: left;
		flex-grow: 0;
		padding: 0 1rem
	}
}

</style>
