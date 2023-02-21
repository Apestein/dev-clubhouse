"use client"
import useSWR from "swr"
import React, { useState, useEffect } from "react"
import * as Realm from "realm-web"
import { AiFillEdit, AiFillDelete, AiFillHeart } from "react-icons/ai"
import generateRandomAnimal from "random-animal-name"
import { useSession } from "next-auth/react"
import Image from "next/image"

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
    mutate(
      messages?.map((message) => (message._id === data._id ? data : message))
    )
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
    <main className="flex flex-col items-center">
      <h1 className="text-3xl font-bold">Dev's Hot Takes ClubHouse</h1>
      <h2 className="text-lg font-bold">
        Please give a hot take or controversial opinion about certain
        technologies or the tech industry in general
      </h2>
      <ul>
        {messages?.map((message) => (
          <li key={message._id} className="flex w-[80vw] bg-zinc-200">
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
            <div className="p-1">
              <span className="mr-3">
                {message.author ? message.author : generateRandomAnimal()}
              </span>
              <span>{message.timestamp.toString()}</span>
              <p
                onKeyDown={(e) => handleSubmitOrCancel(e, message)}
                data-default={message.content}
                id={message._id}
                className="break-all outline-none"
              >
                {message.content}
              </p>
            </div>
            <i className="flex text-3xl text-neutral-700">
              <AiFillHeart
                className="ml-3 text-red-500"
                onClick={() => handleUpdateHeart(message._id)}
              />
              <p className="mr-3 text-xl">{message.hearts} </p>
              {/* <AiFillEdit onClick={() => handleEdit(message._id)} />
              <AiFillDelete onClick={() => handleDelete(message._id)} /> */}
              {session?.user?.email === message.email && (
                <>
                  <AiFillEdit onClick={() => handleEdit(message._id)} />
                  <AiFillDelete onClick={() => handleDelete(message._id)} />
                </>
              )}
            </i>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreate}>
        <textarea
          placeholder={session ? "Type message here" : "Must be signed in"}
          required
          maxLength={1000}
          onInput={(e) => setTextAreaHeight(e)}
          className="w-[80vw] resize-none p-1 outline outline-1 outline-black"
        />
        <button
          disabled={session ? false : true}
          className="block rounded-xl bg-green-500 px-3 py-1 text-black"
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
  timestamp: Date
  content: string
  image?: string
  _id: string
  hearts: number
}
