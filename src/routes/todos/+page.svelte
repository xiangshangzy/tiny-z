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
				crud={{
					insert: async ({ text, done }) => {
						await fetch("/todos", {
							method: "POST",
							body: JSON.stringify({ type: "insert", text: text, done: done }),
							headers: {
								"Content-Type": "application/json",
							},
						});
					},
					update: async ({ id, text, done }) => {
						await fetch("/todos", {
							method: "POST",
							body: JSON.stringify({
								type: "update",
								id: id,
								text: text,
								done: done,
							}),
							headers: {
								"Content-Type": "application/json",
							},
						});
					},
					delete: async ({ id }) => {
						await fetch("/todos", {
							method: "POST",
							body: JSON.stringify({ type: "delete", id: id }),
							headers: {
								"Content-Type": "application/json",
							},
						});
					},
					reload: () => {
						invalidate("app:todos");
					},
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
