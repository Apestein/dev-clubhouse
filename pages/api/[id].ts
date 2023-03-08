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
  const totalPages = Math.ceil((await Message.count()) / 20)

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
              .skip((totalPages - pageNumber) * 20)
              .limit(20)
          : await Message.find({}, { author: 0, image: 0 })
              .sort({ timestamp: 1 })
              .skip((totalPages - pageNumber) * 20)
              .limit(20)
        const returnedMessages = messages.map((message) => {
          const doc = message._doc
          const { liked, ...rest } = doc
          if (liked.includes(session?.user?.email))
            return { ...rest, isLiked: true }
          else return { ...rest, isLiked: false }
        })
        res.status(200).json(returnedMessages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case "PUT":
      try {
        const { msgID, isLiked } = req.query
        if (isLiked === "false")
          await Message.updateOne(
            { _id: msgID },
            {
              $push: { liked: session?.user?.email },
              $inc: { hearts: 1 },
            }
          )
        else
          await Message.updateOne(
            { _id: msgID },
            {
              $pull: { liked: session?.user?.email },
              $inc: { hearts: -1 },
            }
          )
        const messages = await Message.find()
          .sort({ timestamp: 1 })
          .skip((totalPages - pageNumber) * 20)
          .limit(20)
        const returnedMessages = messages.map((message) => {
          const doc = message._doc
          const { liked, ...rest } = doc
          if (liked.includes(session?.user?.email))
            return { ...rest, isLiked: true }
          else return { ...rest, isLiked: false }
        })
        res.status(200).json(returnedMessages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
  }
}
