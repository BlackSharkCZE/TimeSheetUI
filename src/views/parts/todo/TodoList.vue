<template>
	<div>
		<div>
			<todo-form v-on:ItemCreated="updateList"/>
		</div>
		<div>
			<ul class="todo">
				<li v-for="(todo, index) of todoList" v-bind:key="todo.id">
					<todo-item v-model="todoList[index]" v-on:ItemDeleted="removeItem($event)"></todo-item>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

import TodoItem from '@/views/parts/todo/TodoItem'
import { TimesheetGraph } from '@/services/TimesheetGraph'
import TodoForm from '@/views/parts/todo/TodoForm'

export default {
	name: 'TodoList',
	components: {
		TodoForm,
		TodoItem
	},
	data() {
		return {
			todoList: []
		}
	},
	mounted() {
		this.reloadData()
	},
	methods: {
		reloadData() {
			TimesheetGraph.todo.allTodos().then(data => {
				this.todoList = data.data.allTodo
			})
		},
		removeItem($event) {
			this.reloadData()
		},
		updateList(item) {
			this.reloadData()
		}
	}
}
</script>

<style scoped lang="scss">

ul {
	&.todo {
		font-size: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			padding: 0.2em;

			&:HOVER {
				background-color: $bs-table-color-selected;
			}
		}
	}
}

</style>
