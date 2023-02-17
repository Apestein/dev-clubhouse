"use client"
import useSWR from "swr"
import React, { useState, useEffect } from "react"
import * as Realm from "realm-web"
import { AiFillEdit, AiFillDelete } from "react-icons/ai"
import generateRandomAnimal from "random-animal-name"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function App() {
  // const app = new Realm.App({ id: "dev-clubhouse-iqyij" })
  // const [user, setUser] = useState<any>()
  // useEffect(() => {
  //   const login = async () => {
  //     const user = await app.logIn(Realm.Credentials.anonymous())
  //     setUser(user)
  //     const mongodb = app.currentUser?.mongoClient("mongodb-atlas")
  //     const collection = mongodb?.db("message-board").collection("messages")
  //     console.log(collection!.watch())
  //     for await (const change of collection!.watch()) {
  //       console.log(change)
  //       mutate()
  //     }
  //   }
  //   login()
  // }, [])

  async function handleCreate(e: any) {
    e.preventDefault()
    const content = {
      author: session?.user?.name,
      timestamp: new Date(),
      content: e.target[0].value,
      image: session?.user?.image,
    }
    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    const data = await res.json()
    mutate(
      messages?.map((message) => (message._id === data._id ? data : message))
    )
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
      update: e.target.textContent,
    }
    await fetch("/api", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    mutate()
  }

  function handleEdit(id: string) {
    const el = document.getElementById(id)
    el?.toggleAttribute("contentEditable")
    el?.focus()
    el?.classList.toggle("bg-transparent")
    el?.classList.toggle("bg-neutral-500")
  }

  function setTextAreaHeight(e: any) {
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
  }

  function handleSubmitOrCancel(e: any, message: Message) {
    const previousValue = e.currentTarget.dataset.default
    if (e.key === "Escape" || e.key === "Enter") handleEdit(message._id)
    if (e.key === "Enter") {
      handleUpdate(e, message._id)
    } else if (e.key === "Escape") e.currentTarget.textContent = previousValue!
  }

  const { data: session } = useSession()
  const {
    data: messages,
    error,
    isLoading,
    mutate,
  } = useSWR<Message[]>("/api", fetcher)
  if (error) return "An error has occurred."
  if (isLoading) return "Loading..."
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>Dev Hot Takes ClubHouse</h1>
      <ul>
        {messages?.map((message) => (
          <li key={message._id} className="flex w-[80vw] bg-neutral-300">
            <Image
              alt="profile-pic"
              src={
                message.image
                  ? message.image
                  : `https://api.dicebear.com/5.x/bottts/jpg?seed=${message._id}`
              }
              width={50}
              height={50}
              className="h-full"
            />
            <div>
              <span className="mr-3">
                {message.author ? message.author : generateRandomAnimal()}
              </span>
              <span>{message.timestamp.toString()}</span>
              <AiFillEdit
                onClick={() => handleEdit(message._id)}
                className="inline text-3xl"
              />
              <AiFillDelete
                onClick={() => handleDelete(message._id)}
                className="inline text-3xl"
              />
              <p
                onKeyDown={(e) => handleSubmitOrCancel(e, message)}
                data-default={message.content}
                id={message._id}
                className="break-all"
              >
                {message.content}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreate}>
        <textarea
          placeholder={session ? "Type message here" : "Must be signed in"}
          required
          maxLength={1000}
          onInput={(e) => setTextAreaHeight(e)}
          className="w-[80vw] resize-none outline outline-1 outline-black"
        />
        <button disabled={session ? false : true} className="block">
          Send
        </button>
      </form>
    </main>
  )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
type Message = {
  author: string
  timestamp: Date
  content: string
  image: string
  _id: string
}
