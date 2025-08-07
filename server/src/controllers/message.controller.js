import Message from "../models/Message.js";

// export const getMessages = async (req, res) => {
//   try{
//     const senderId = req.user.userId;
//     const receiverId = req.params.id;

//     const messages = await Message.find({
//       $or: [
//         { sender: senderId, receiver: receiverId },
//         { sender: receiverId, receiver: senderId }
//       ]
//     }).sort({ timestamp: 1 });

//     res.status(200).json(messages);
//   }catch(err){
//     console.error("getMessages error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const postMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ error: "Receiver and text are required" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: text
    });

    // console.log(newMessage); //you are woring now

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("postMessage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'username avatar_url')
    .populate('receiver', 'username avatar_url')
    .sort({ createdAt: 1 });

    console.log("Getting all messages")

    res.status(200).json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);
    
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.params;

    await Message.updateMany(
      { 
        sender: userId, 
        receiver: currentUserId, 
        isRead: false 
      },
      { isRead: true }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("markMessagesAsRead error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};