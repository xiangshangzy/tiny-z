<script lang="ts">
	import type { PageProps } from "./$types";
	import Todo from "./Todo.svelte";
	import { invalidate } from "$app/navigation";
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Todo</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<div class="text-coumn">
	<h1>About this app</h1>

	<div class="todos">
		{#await data.todos}
			<span>loading todos</span>
		{:then todos}
			<Todo
				items={todos}
				submitOps={async ({ insertList, updateList, deleteList }) => {
					await fetch("/todos/api", {
						method: "POST",
						body: JSON.stringify({
							insertList: insertList,
							updateList: updateList,
							deleteList: deleteList,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					});
					invalidate("app:todos");
				}}
			/>
		{:catch err}
			<span>loading error: {err.message}</span>
		{/await}
	</div>
</div>

<style>
	.todos {
		height: 200px;
	}
</style>
