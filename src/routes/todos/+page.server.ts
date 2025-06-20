import type { PageServerLoad } from './$types';
import { getTodos } from '$lib/server/router/todos';

export const load: PageServerLoad = async ({ depends }) => {
  depends('app:todos')
  return { todos: getTodos() }
};
