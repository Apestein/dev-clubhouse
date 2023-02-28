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
  console.log(session)
  const { method } = req

  switch (method) {
    case "GET":
      try {
        const messages = session
          ? await Message.find({}, { __v: 0 }).limit(10)
          : await Message.find({}, { __v: 0, author: 0, image: 0 }).limit(10)
        res.status(200).json(messages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "POST":
      try {
        if (!session)
          return res.status(400).json({ error: "not authenticated" })
        const message = await Message.create(req.body)
        res.status(201).json(message)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "PUT":
      try {
        if (!session)
          return res.status(400).json({ error: "not authenticated" })
        const { _id, update, hearts } = req.body
        let data
        if (hearts) {
          await Message.updateOne({ _id: _id }, { $inc: { hearts: 1 } })
          data = await Message.find({})
        } else
          data = await Message.updateOne(
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
        if (!session)
          return res.status(400).json({ error: "not authenticated" })
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
