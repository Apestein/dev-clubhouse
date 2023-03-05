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
  const method = req.method
  const pageNumber = +req.query.id!
  const totalPages = Math.ceil((await Message.count()) / 10)

  switch (method) {
    case "GET":
      try {
        if (req.query.id === "count") {
          const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1)
          return res.status(200).json(pagesArray)
        }

        const messages = session
          ? await Message.find()
              .sort({ timestamp: 1 })
              .skip((totalPages - pageNumber) * 10)
              .limit(10)
          : await Message.find({}, { author: 0, image: 0 })
              .sort({ timestamp: 1 })
              .skip((totalPages - pageNumber) * 10)
              .limit(10)
        res.status(200).json(messages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "PUT":
      try {
        const msgID = req.query.msgID
        await Message.updateOne({ _id: msgID }, { $inc: { hearts: 1 } })
        const messages = await Message.find()
          .sort({ timestamp: 1 })
          .skip((totalPages - pageNumber) * 10)
          .limit(10)
        res.status(200).json(messages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
  }
}
