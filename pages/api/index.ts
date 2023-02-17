import { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "lib/dbConnect"
import Message from "@/models/Message"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()
  const session = await getSession({ req })
  // const session = await getServerSession(req, res, authOptions)
  console.log(session)
  const { method } = req

  switch (method) {
    case "GET":
      try {
        const messages = session
          ? await Message.find({}, { __v: 0 })
          : await Message.find({}, { __v: 0, author: 0, image: 0 })
        res.status(200).json(messages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "POST":
      try {
        const message = await Message.create(req.body)
        res.status(201).json(message)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "PUT":
      try {
        const { _id, update } = req.body
        const message = await Message.updateOne(
          { _id: _id },
          { $set: { content: update } }
        )
        res.status(200).json({ success: message })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "DELETE":
      try {
        const id = req.body._id
        const message = await Message.deleteOne({ _id: id })
        res.status(200).json({ success: message })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
  }
}
