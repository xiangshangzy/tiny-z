import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addTodo, deleteTodo, updateTodo } from '$lib/server/router/todos';

export const POST: RequestHandler = async ({ request }) => {
  const dto: { type: 'insert'; text: string, done: boolean } | {
    type: 'update'; id: number, text: string | undefined, done: boolean | undefined
  } | { type: 'delete'; id: number }
    = await request.json()
  switch (dto.type) {
    case 'insert': await addTodo(dto.text, dto.done)
      break;
    case 'delete': await deleteTodo(dto.id)
      break;
    case 'update':
      await updateTodo(dto.id, dto.text, dto.done)
      break;
  }
  return json({ type: dto.type, msg: 'ok' })
};
