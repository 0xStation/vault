import { useState } from "react"
import useSWR from "swr"

type Todo = {
  id: number
  text: string
}

let todos = [] as Todo[]
const delay = () => new Promise((resolve) => setTimeout(resolve, 1000))

const addTodo = async (todo: Todo) => {
  await delay()
  todos = [...todos, todo]
  return todos
}

const getTodos = async () => {
  await delay()
  return todos
}

const TodoPage = () => {
  const [text, setText] = useState<string>("")
  const { data, mutate } = useSWR("/api/todos", getTodos)
  const onSubmit = () => {
    const todo = { id: Date.now(), text }
    mutate(addTodo(todo), {
      optimisticData: [...(data as Todo[]), todo],
      populateCache: false,
      revalidate: false,
    })
    setText("")
  }

  return (
    <div className="mx-auto mt-12 max-w-[600px]">
      <h1 className="text-center">Todos</h1>
      <form
        onSubmit={(ev) => ev.preventDefault()}
        className="mt-6 flex space-x-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          className="grow border border-gray-40 bg-gray-80 p-2"
        />
        <button
          type="submit"
          onClick={() => onSubmit()}
          className="border border-violet-80 bg-violet px-2"
        >
          Add
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        {data
          ? data.map((todo) => {
              return (
                <li className="bg-gray-90 p-2" key={todo.id}>
                  {todo.text}
                </li>
              )
            })
          : null}
      </ul>
    </div>
  )
}

export default TodoPage
