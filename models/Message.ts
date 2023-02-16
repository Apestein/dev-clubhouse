import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  author: String,
  timestamp: Date,
  content: String,
  image: String,
})

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema)
