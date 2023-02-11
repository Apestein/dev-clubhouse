"use client"
import dbConnect from "lib/dbConnect"
import User from "models/User"
import Message from "models/Message"
import useSWR from "swr"
import { AiFillEdit, AiFillDelete } from "react-icons/ai"
import { text } from "stream/consumers"

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
    e.preventDefault()
    const content = {
      _id: id,
      update: e.target[0].value,
    }
    await fetch("/api", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    mutate()
  }

  function handleEdit(id: string) {
    const textareaElement = document.getElementById(id)
    textareaElement?.focus()
    textareaElement?.toggleAttribute("readOnly")
    textareaElement?.classList.toggle("bg-transparent")
    textareaElement?.classList.toggle("bg-neutral-500")
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
            <li key={message._id} className="bg-neutral-300">
              <span className="mr-3">{message.author}</span>
              <span>{message.timestamp.toString()}</span>
              <AiFillEdit
                onClick={(e) => handleEdit(message._id)}
                className="inline text-3xl"
              />
              <AiFillDelete
                onClick={() => handleDelete(message._id)}
                className="inline text-3xl"
              />
              {/* <p>{message.content}</p> */}
              <form onSubmit={(e) => handleUpdate(e, message._id)}>
                <textarea
                  readOnly
                  onInput={(e) => {
                    e.currentTarget.style.height = "24px"
                    e.currentTarget.style.height =
                      e.currentTarget.scrollHeight + "px"
                  }}
                  onKeyDown={(e) => {
                    const previousValue = e.currentTarget.defaultValue
                    if (e.key === "Escape" || e.key === "Enter")
                      handleEdit(message._id)
                    if (e.key === "Enter") {
                      e.currentTarget.form?.requestSubmit()
                    } else if (e.key === "Escape")
                      e.currentTarget.value = previousValue
                  }}
                  defaultValue={message.content}
                  id={message._id}
                  className="h-6 w-full resize-none bg-transparent focus:outline-none"
                />
              </form>
            </li>
          )
        )}
      </ul>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          required
          className="outline outline-1 outline-black"
        />
        <button>Send</button>
      </form>
    </main>
  )
}
