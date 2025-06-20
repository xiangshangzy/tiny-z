import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addTodos, deleteTodos, updateTodos } from '$lib/server/router/todos';

export const POST: RequestHandler = async ({ request }) => {
  const dto
    = await request.json() satisfies {
      insertList: { text: string, done: boolean }[]
      updateList: { id: number, text: string | undefined, done: boolean | undefined }[]
      deleteList: { id: number }[]
    }

  const tasks: Promise<void>[] = []
  if (dto.insertList.length > 0)
    tasks.push(addTodos(dto.insertList))
  if (dto.updateList.length > 0)
    tasks.push(updateTodos(dto.updateList))
  if (dto.deleteList.length > 0)
    tasks.push(deleteTodos(dto.deleteList))
  await Promise.all(tasks)
  return json({ type: 'todosApi', msg: 'ok' })
};
