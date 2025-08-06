import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try{
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  }catch(err){
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postMessage = async (req, res) => {
  try{
    const senderId = req.user.userId;
    const { receiver, text: content } = req.body;

    if(!receiver || !content){
      return res.status(400).json({ error: "Receiver and text are required" });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver,
      content
    });

    const savedMessage = await newMessage.save();

    // Optional: emit Socket.IO event here
    // io.to(receiverSocketId).emit("receive_message", savedMessage);

    res.status(201).json(savedMessage);
  }catch(err){
    console.error("postMessage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try{
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if(!message) return res.status(404).json({ error: "Message not found" });

    // Optional: Only sender can delete
    if(message.sender.toString() !== userId){
      return res.status(403).json({ error: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  }catch(err){
    console.error("deleteMessage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
