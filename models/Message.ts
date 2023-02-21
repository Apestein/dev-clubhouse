import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  author: String,
  email: String,
  timestamp: Date,
  content: String,
  image: String,
  hearts: Number,
})

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema)
