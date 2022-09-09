<template>
	<div class="simple-content">
		<h2>TODO</h2>
		<todo-list></todo-list>
	</div>
</template>

<script>
import TodoList from '@/views/parts/todo/TodoList'
export default {
	name: 'Todo',
	components: { TodoList }
}
</script>

<style scoped lang="scss">
</style>
