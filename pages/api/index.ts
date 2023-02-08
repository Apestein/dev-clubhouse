import mongoose from "mongoose"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uri = process.env.MONGODB_URI
  mongoose.connect(uri!, () => console.log("connected"))

  res.status(200).send("ok")
}
