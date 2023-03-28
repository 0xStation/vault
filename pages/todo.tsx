import { useState } from "react"
import useSWR from "swr"
import LoadingSpinner from "../src/components/core/LoadingSpinner"
import { useToast } from "../src/hooks/useToast"

enum TodoStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

type Todo = {
  id: number
  text: string
  status: TodoStatus
}
let initialTodo = { id: 1, text: "testing", status: TodoStatus.COMPLETED }
let todos = [initialTodo] as Todo[]
const delay = () => new Promise((resolve) => setTimeout(resolve, 1000))
const getTodos = async () => {
  await delay()
  return todos
}

const addTodo = async (todo: Todo, isError: boolean) => {
  await delay()
  if (isError) {
    throw new Error("Failed to add new item!")
  }

  todos = [...todos, { ...todo, status: TodoStatus.COMPLETED }]
  return todos
}

// the "correct" way to update todos
const updateTodo = async (todo: Todo, isError: boolean) => {
  await delay()
  if (isError) {
    throw new Error("Failed to update item!")
  }

  todos = todos.map((t) =>
    t.id === todo.id ? { ...todo, status: TodoStatus.COMPLETED } : t,
  )
  return todos
}

const updateTodoReturnsTodo = async (todo: Todo, isError: boolean) => {
  await delay()
  if (isError) {
    throw new Error("Failed to update item!")
  }

  const updatedTodo = { ...todo, status: TodoStatus.COMPLETED }

  todos = todos.map((t) => (t.id === todo.id ? updatedTodo : t))
  return updatedTodo
}

const TodoListItem = ({ todo, mutate }: { todo: Todo; mutate: any }) => {
  const { successToast, errorToast } = useToast()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [text, setText] = useState<string>(todo.text)

  const onSubmit = async (type: string) => {
    const isError = type === "error"
    try {
      const updatedTodo = {
        ...todo,
        text,
        status: TodoStatus.PENDING,
      }

      await mutate(updateTodoReturnsTodo(updatedTodo, isError), {
        // optimisticData can be a function that takes in current data and returns the new data. This greatly helps the need to either pass down the data or hoist the mutate
        optimisticData: (data: Todo[]) => {
          return data.map((t) => (t.id === todo.id ? updatedTodo : t))
        },
        rollbackOnError: true,
        // populateCache: false,
        populateCache: (updatedTodo: Todo, todos: Todo[]) => {
          return todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
        },
        revalidate: true,
      })
      setText(updatedTodo.text)
      successToast({ message: "success" })
    } catch (e) {
      console.log(e)
      setText(todo.text)
      errorToast({ message: "error" })
    }
  }

  if (isEditing) {
    return (
      <li className="rounded bg-gray-90 p-2">
        <form className="flex flex-row justify-between space-x-2">
          <input
            value={text}
            className="grow border border-gray-40 bg-gray-80"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue px-2"
            onClick={() => {
              setIsEditing(false)
              onSubmit("success")
            }}
          >
            Save
          </button>
          <button
            type="submit"
            onClick={() => {
              setIsEditing(false)
              onSubmit("error")
            }}
            className=" bg-blue px-2"
          >
            Save (with error)
          </button>
        </form>
      </li>
    )
  }

  return (
    <li className="flex w-full flex-row justify-between rounded bg-gray-90 p-2 text-white">
      <span className="flex flex-row items-center space-x-2">
        {todo.status === TodoStatus.PENDING && <LoadingSpinner />}
        <span>{todo.text}</span>
      </span>
      <button className="bg-green px-2" onClick={() => setIsEditing(true)}>
        Edit
      </button>
    </li>
  )
}

const TodoDemoPage = () => {
  const { successToast, errorToast } = useToast()
  const [text, setText] = useState<string>("")

  // in this case /api/todos is a key
  // you can make it the real endpoint and pass that along to the fetcher
  // but since we are just mocking API calls in this case, we will roll with this
  const { data, mutate } = useSWR("/api/todos", getTodos)

  const onSubmit = async (type: string) => {
    const isError = type === "error"
    setText("")

    const newTodo = {
      id: Date.now(),
      text,
      status: TodoStatus.PENDING,
    }

    try {
      // Update the local state immediately and fire the
      // request. Since the API will return the updated
      // data, there is no need to start a new revalidation
      // and we can directly populate the cache.
      await mutate(addTodo(newTodo, isError), {
        optimisticData: [...(data as Todo[]), newTodo],
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      })
      successToast({ message: "success" })
    } catch (e) {
      errorToast({ message: "Error" })
      console.log(e)
    }
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
          onClick={() => onSubmit("success")}
          className="border border-violet-80 bg-violet px-2"
        >
          Add
        </button>
        <button
          type="submit"
          onClick={() => onSubmit("error")}
          className="border border-violet-80 bg-violet px-2"
        >
          Add (with error)
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        {data
          ? data.map((todo) => {
              return <TodoListItem todo={todo} key={todo.id} mutate={mutate} />
            })
          : null}
      </ul>
    </div>
  )
}

export default TodoDemoPage