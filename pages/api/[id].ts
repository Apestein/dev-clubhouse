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
  const pageNumber = req.query.id
  if (!Number.isInteger(+pageNumber!)) res.status(400).json("not a number")

  switch (method) {
    case "GET":
      try {
        const messages = session
          ? await Message.find()
              .sort({ timestamp: 1 })
              .skip(+pageNumber! * 10 - 9)
              .limit(10)
          : await Message.find({}, { author: 0, image: 0 })
              .sort({ timestamp: 1 })
              .skip(+pageNumber! * 10 - 9)
              .limit(10)
        console.log(messages)
        res.status(200).json(messages)
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
  }
}
