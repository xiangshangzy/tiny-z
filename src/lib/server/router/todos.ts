import { db } from "$lib/server/db"
import { todosTable } from "$lib/server/schema"
import { eq, inArray } from "drizzle-orm";
import type { NeonHttpQueryResult } from "drizzle-orm/neon-http";
export const getTodos = async () => {
  const todos = await db.select().from(todosTable).orderBy(todosTable.id).execute()
  return todos;
}

export const addTodos = async (list: { text: string, done: boolean }[]) => {
  const fields = list.map(x => ({ text: x.text, done: x.done }))
  await db.insert(todosTable).values(fields)
}

export const updateTodos = async (list: { id: number, text: string | undefined, done: boolean | undefined }[]) => {
  const tasks: Promise<NeonHttpQueryResult<never> | undefined>[] = []
  for (const item of list) {
    const fields = { text: item.text, done: item.done }
    tasks.push(db.update(todosTable).set(fields).where(eq(todosTable.id, item.id)))
  }
  await Promise.all(tasks)
}
export const deleteTodos = async (list: { id: number }[]) => {
  await db.delete(todosTable).where(inArray(todosTable.id, list.map(x => x.id)))
}
