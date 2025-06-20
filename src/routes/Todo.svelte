<script lang="ts">
	interface Props {
		items: { id: number; text: string; done: boolean }[];
		crud:
			| {
					insert: ({
						text,
						done,
					}: {
						text: string;
						done: boolean;
					}) => Promise<void>;
					update: ({
						id,
						text,
						done,
					}: {
						id: number;
						text: string | undefined;
						done: boolean | undefined;
					}) => Promise<void>;
					delete: ({ id }: { id: number }) => Promise<void>;
					reload: () => void;
			  }
			| undefined;
	}
	let { items, crud }: Props = $props();
	let incrementalOps: (
		| { type: "insert"; id: number; text: string; done: boolean }
		| { type: "delete"; id: number }
		| { type: "updateText"; id: number; text: string }
		| { type: "updateDone"; id: number; done: boolean }
		| {
				type: "update";
				id: number;
				text: string | undefined;
				done: boolean | undefined;
		  }
	)[] = $state([]);

	let fullItems = $derived.by(() => {
		let fullItems = [...items];

		for (let op of incrementalOps) {
			switch (op.type) {
				case "insert":
					fullItems.push({
						id: op.id,
						text: op.text,
						done: op.done,
					});
					break;
				case "update":
					const idx = fullItems.findIndex((x) => x.id === op.id);
					if (typeof op.text !== "undefined") {
						fullItems[idx] = { ...fullItems[idx], text: op.text };
					}
					if (typeof op.done !== "undefined")
						fullItems[idx] = { ...fullItems[idx], done: op.done };
					break;

				case "delete":
					fullItems.splice(
						fullItems.findIndex((x) => x.id === op.id),
						1,
					);
					break;
			}
		}
		return fullItems;
	});

	const AggregateIncrementalOp = (
		aggregateOp: (typeof incrementalOps)[number],
	) => {
		let isFirst = true;
		let isPush = true;
		switch (aggregateOp.type) {
			case "updateText":
				for (let i = 0; i < incrementalOps.length; i++) {
					let op = incrementalOps[i];
					if (
						(op.type === "insert" || op.type === "update") &&
						op.id === aggregateOp.id
					) {
						if (isFirst) {
							incrementalOps[i] = {
								...op,
								text: aggregateOp.text,
							};
							isFirst = false;
							isPush = false;
						} else incrementalOps.splice(i, 1);
					}
				}
				if (isPush)
					aggregateOp = {
						type: "update",
						id: aggregateOp.id,
						text: aggregateOp.text,
						done: undefined,
					};
				break;
			case "updateDone":
				for (let i = 0; i < incrementalOps.length; i++) {
					let op = incrementalOps[i];
					if (
						(op.type === "insert" || op.type === "update") &&
						op.id === aggregateOp.id
					) {
						if (isFirst) {
							incrementalOps[i] = {
								...op,
								done: aggregateOp.done,
							};
							isFirst = false;
							isPush = false;
						} else incrementalOps.splice(i, 1);
					}
				}
				if (isPush)
					aggregateOp = {
						type: "update",
						id: aggregateOp.id,
						text: undefined,
						done: aggregateOp.done,
					};
				break;
			case "delete":
				for (let i = 0; i < incrementalOps.length; i++) {
					let op = incrementalOps[i];
					if (op.type !== "delete" && op.id === aggregateOp.id) {
						incrementalOps.splice(i, 1);
						if (isFirst) {
							isFirst = false;
							if (op.type === "insert") isPush = false;
						}
					}
				}
				break;
		}
		if (isPush) incrementalOps.push(aggregateOp);
	};
</script>

<div class="centered">
	<h1>todos</h1>
	<label>
		add a todo:
		<input
			type="text"
			autocomplete="off"
			onkeydown={async (e) => {
				if (e.key !== "Enter") return;
				const input = e.currentTarget;
				const text = input.value;
				AggregateIncrementalOp({
					type: "insert",
					id: fullItems.reduce((x, y) => (y.id > x ? y.id : x) + 1, 0),
					text: text,
					done: false,
				});
				input.value = "";
			}}
		/>
	</label>

	{#if incrementalOps.length > 0}
		<button
			onclick={async () => {
				if (typeof crud === "undefined") {
					incrementalOps = [];
					return;
				}

				for (const op of incrementalOps) {
					switch (op.type) {
						case "insert":
							await crud.insert(op);
							break;
						case "update":
							await crud.update(op);
							break;
						case "delete":
							await crud.delete(op);
							break;
					}
				}
				crud.reload();
			}}>submit</button
		>
		<button
			onclick={() => {
				incrementalOps = [];
			}}>reset</button
		>
	{/if}
	<ul class="todos">
		{#each fullItems as item (item.id)}
			<li>
				<label>
					<input
						type="checkbox"
						checked={item.done}
						onchange={(e) => {
							const checked = e.currentTarget.checked;
							AggregateIncrementalOp({
								type: "updateDone",
								id: item.id,
								done: checked,
							});
						}}
					/>
				</label>

				<span>
					<input
						required
						onblur={(e) => {
							const text = e.currentTarget.value;
							if (text === "") return;
							AggregateIncrementalOp({
								type: "updateText",
								id: item.id,
								text: text,
							});
						}}
						value={item.text}
					/></span
				>
				<button
					aria-label="Mark as complete"
					onclick={() => {
						AggregateIncrementalOp({ type: "delete", id: item.id });
					}}>delete</button
				>
			</li>
		{/each}
	</ul>
	<span>Operations:</span>
	<ul>
		{#each incrementalOps as op (op.id)}
			<li>
				<span
					>{op.type}
					{op.id}
					{op.type === "insert" ? op.done + " " + op.text : ""}
					{op.type === "update"
						? (op.done !== undefined ? op.done : "") +
							" " +
							(op.text !== undefined ? op.text : "")
						: ""}
				</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.centered {
		max-width: 20em;
		margin: 0 auto;
	}

	li {
		display: flex;
		width: 100%;
		align-items: center;
	}

	input[type="text"] {
		flex: 1;
	}

	span {
		flex: 1;
	}

	button:hover {
		opacity: 1;
	}
</style>
