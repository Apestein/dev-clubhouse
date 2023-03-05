import { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "lib/dbConnect"
import Message from "@/models/Message"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(400).json({ error: "not authenticated" })
  const { method } = req

  switch (method) {
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
        const data = await Message.updateOne(
          { _id: _id },
          { $set: { content: update } }
        )
        res.status(200).json(data)
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
