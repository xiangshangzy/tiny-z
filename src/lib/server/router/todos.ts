import { db } from "$lib/server/db"
import { todosTable, usersTable } from "$lib/server/schema"
import { eq } from "drizzle-orm";

export const getTodos = async () => {
  const todos = await db.select().from(todosTable).orderBy(todosTable.id).execute()
  return todos;
}

export const addTodo = async (text: string, done: boolean = false) => {
  await db.insert(todosTable).values({ text: text, done: done })
}

export const updateTodo = async (id: number, text: string | undefined, done: boolean | undefined) => {
  await db.update(todosTable).set({ text: text, done: done }).where(eq(todosTable.id, id))
}
export const deleteTodo = async (id: number) => {
  await db.delete(todosTable).where(eq(todosTable.id, id))
}
