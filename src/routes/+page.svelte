<script lang="ts">
	import welcome from "$lib/images/svelte-welcome.webp";
	import welcomeFallback from "$lib/images/svelte-welcome.png";
	import type { PageProps } from "./$types";
	import Todo from "./Todo.svelte";
	import { invalidate } from "$app/navigation";
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>
	</h1>
	<div class="todos">
		{#await data.todos}
			<span>loading todos</span>
		{:then todos}
			<Todo
				items={todos}
				crud={{
					insert: async ({ text, done }) => {
						await fetch("/api/todos", {
							method: "POST",
							body: JSON.stringify({ type: "insert", text: text, done: done }),
							headers: {
								"Content-Type": "application/json",
							},
						});
					},
					update: async ({ id, text, done }) => {
						await fetch("/api/todos", {
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
						await fetch("/api/todos", {
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
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
	.todos {
		height: 200px;
	}
</style>
