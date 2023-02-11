"use client"
import dbConnect from "lib/dbConnect"
import User from "models/User"
import Message from "models/Message"
import useSWR from "swr"
import { AiFillEdit, AiFillDelete } from "react-icons/ai"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function App() {
  async function handleCreate(e: any) {
    e.preventDefault()
    const content = {
      author: "anon",
      timestamp: new Date(),
      content: e.target[0].value,
    }
    await fetch("/api", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    mutate()
  }

  async function handleDelete(id: string) {
    const content = { _id: id }
    await fetch("/api", {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    mutate()
  }

  async function handleUpdate(e: any, id: string) {
    const content = {
      _id: id,
      update: "placeholder",
    }
    await fetch("/api", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    mutate()
  }

  const { data, error, isLoading, mutate } = useSWR("/api", fetcher)
  if (error) return "An error has occurred."
  if (isLoading) return "Loading..."
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>Min-Maxing Dev ClubHouse</h1>
      <ul>
        {data?.map(
          (message: {
            author: string
            timestamp: Date
            content: string
            _id: string
          }) => (
            <li>
              <span className="mr-3">{message.author}</span>
              <span>{message.timestamp.toString()}</span>
              <AiFillEdit
                onClick={(e) => handleUpdate(e, message._id)}
                className="inline text-3xl"
              />
              <AiFillDelete
                onClick={() => handleDelete(message._id)}
                className="inline text-3xl"
              />
              {/* <p>{message.content}</p> */}
              <form>
                <textarea
                  className="text-black"
                  readOnly
                  cols={30}
                  defaultValue={message.content}
                />
              </form>
            </li>
          )
        )}
      </ul>
      <form onSubmit={handleCreate}>
        <input type="text" required className="text-black" />
        <button>Send</button>
      </form>
    </main>
  )
}
