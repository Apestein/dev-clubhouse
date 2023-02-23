"use client"
import useSWR from "swr"
import React, { useEffect } from "react"
import * as Realm from "realm-web"
import { AiFillEdit, AiFillDelete, AiFillHeart } from "react-icons/ai"
import generateRandomAnimal from "random-animal-name"
import { useSession } from "next-auth/react"
import Image from "next/image"
import SpinnerXlBasicHalf from "./Spinner"

export default function App() {
  const app = new Realm.App({ id: "dev-clubhouse-iqyij" })
  useEffect(() => {
    const login = async () => {
      await app.logIn(Realm.Credentials.anonymous())
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas")
      const collection = mongodb?.db("message-board").collection("messages")
      for await (const change of collection!.watch()) {
        mutate()
      }
    }
    login()
  }, [])

  async function handleCreate(e: any) {
    e.preventDefault()
    const content = {
      author: session?.user?.name,
      email: session?.user?.email,
      timestamp: new Date(),
      content: e.target[0].value,
      image: session?.user?.image,
      hearts: 0,
    }
    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    const data = await res.json()
    mutate([...messages!, data])
    e.target.reset()
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

  async function handleUpdateHeart(id: string) {
    const content = { _id: id, hearts: true }
    const res = await fetch("/api", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(content),
    })
    const data = await res.json()
    console.log(data)
    return data
  }

  function updateLocalHeart(id: string) {
    if (!session) return
    mutate(handleUpdateHeart(id), {
      optimisticData: messages?.map((message) =>
        message._id === id
          ? { ...message, hearts: message.hearts + 1 }
          : message
      ),
      rollbackOnError: true,
    })
  }

  function handleEdit(id: string) {
    const el = document.getElementById(id)
    el?.toggleAttribute("contentEditable")
    el?.focus()
    el?.classList.toggle("bg-transparent")
    el?.classList.toggle("bg-zinc-200")
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
  if (isLoading) return <SpinnerXlBasicHalf />
  return (
    <main className="mb-3 flex flex-col items-center text-xs md:text-base">
      <h2 className="text-center font-bold md:text-xl">
        Please give a hot take or controversial opinion about certain
        technologies or the tech industry in general
      </h2>
      <ul>
        {messages?.map((message) => (
          <li key={message._id} className="flex w-[80vw] bg-emerald-100 p-3">
            <Image
              alt="profile-pic"
              src={
                session
                  ? message.image ||
                    `https://api.dicebear.com/5.x/bottts/jpg?seed=${message.author}`
                  : `https://api.dicebear.com/5.x/bottts/jpg?seed=${message._id}`
              }
              width={50}
              height={50}
              className="h-full rounded-full"
            />
            <div className="w-full p-1">
              <div className="flex">
                <p className="mr-3">
                  {message.author ? message.author : generateRandomAnimal()}
                </p>
                <p>{new Date(message.timestamp).toLocaleString()}</p>
                <i className="ml-auto inline-flex items-center text-xl text-neutral-700 md:text-3xl">
                  <AiFillHeart
                    className="active:heart-glow ml-3 text-red-500 hover:scale-125"
                    onClick={() => updateLocalHeart(message._id)}
                  />
                  <p className="mr-3 text-xl">{message.hearts} </p>
                  {(session?.user?.email === message.email ||
                    session?.user?.email === "ltn2057@protonmail.com") && (
                    <>
                      <AiFillEdit onClick={() => handleEdit(message._id)} />
                      <AiFillDelete onClick={() => handleDelete(message._id)} />
                    </>
                  )}
                </i>
              </div>
              <p
                onKeyDown={(e) => handleSubmitOrCancel(e, message)}
                data-default={message.content}
                id={message._id}
                className="break-words outline-none"
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
          className="h-20 w-[80vw] resize-none p-1 outline outline-1 outline-black"
        />
        <button
          disabled={session ? false : true}
          className="block h-12 items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-6 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
        >
          SEND
        </button>
      </form>
    </main>
  )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
type Message = {
  author: string
  email: string
  timestamp: string
  content: string
  image?: string
  _id: string
  hearts: number
}
