import { Message } from "../models/Message.model.js";
import { UserModel } from "../models/user.model.js";
import { Designer } from "../models/designer.model.js"; // Adjust path if needed
import { ReadStatus } from "../models/readstatus.model.js";
import logger from "../utils/logger.js";

export const getConvo = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const conversation = await Message.find({
      $or: [
        { from: user1Id, to: user2Id },
        { from: user2Id, to: user1Id },
      ],
    }).sort({ time: 1 });

    const readStatus = await ReadStatus.findOne({
      userId: user2Id,
      partnerId: user1Id,
    });

    const lastRead = readStatus?.lastRead || null;

    // 3. Map messages and attach isSeen
    const conversationWithSeen = conversation.map((msg) => {
      const isFromUser1 = msg.from.toString() === user1Id;
      const isSeen =
        lastRead &&
        isFromUser1 &&
        new Date(lastRead) >= new Date(msg.createdAt);
      return {
        ...msg.toObject(),
        isSeen,
      };
    });

    res.status(200).json(conversationWithSeen);
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "Something went while fetching conversation" });
  }
};

export const getChatsForDesigner = async (req, res) => {
  try {
    const { designerId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: designerId, fromModel: "Designer" },
        { to: designerId, toModel: "Designer" },
      ],
    }).sort({ time: -1 });

    const chatMap = new Map();

    for (const msg of messages) {
      let userId = null;

      if (msg.fromModel === "UserModel" && msg.from.toString() !== designerId) {
        userId = msg.from.toString(); // msg from user
      } else if (
        msg.toModel === "UserModel" &&
        msg.to.toString() !== designerId
      ) {
        userId = msg.to.toString(); // msg to user
      }

      if (userId && !chatMap.has(userId)) {
        chatMap.set(userId, msg); // keep only latest msg per user
      }
    }

    const chatList = Array.from(chatMap.values());
    const userIds = Array.from(chatMap.keys());

    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("_id username profilePicture role")
      .lean();

    const userMap = new Map();
    users.forEach((user) => userMap.set(user._id.toString(), user));

    const readStatuses = await ReadStatus.find({
      userId: designerId,
      partnerId: { $in: userIds },
    }).lean();

    const readMap = new Map();
    readStatuses.forEach((rs) => {
      readMap.set(rs.partnerId.toString(), rs.lastRead);
    });

    const enrichedChats = chatList.map((msg) => {
      const userId =
        msg.fromModel === "UserModel" ? msg.from.toString() : msg.to.toString();

      return {
        sender: userId,
        _id: msg._id,
        message: msg.message,
        time: msg.time,
        user: userMap.get(userId),
        lastRead: readMap.get(userId) || null,
      };
    });

    res.status(200).json(enrichedChats);
  } catch (error) {
    logger.error("Error fetching designer inbox:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateReadStatus = async (req, res) => {
  const { userId, partnerId, lastRead } = req.body;
  try {
    const updated = await ReadStatus.findOneAndUpdate(
      { userId, partnerId },
      { lastRead },
      { upsert: true, new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating read status" });
  }
};

export const getChatsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: userId, fromModel: "UserModel" },
        { to: userId, toModel: "UserModel" },
      ],
    }).sort({ time: -1 });


    const chatMap = new Map();

    for (const msg of messages) {
      let designerUserId = null;

      if (msg.fromModel === "Designer") {
        designerUserId = msg.from.toString();
      } else if (msg.toModel === "Designer") {
        designerUserId = msg.to.toString();
      }


      if (designerUserId && !chatMap.has(designerUserId)) {
        chatMap.set(designerUserId, msg); // latest message from each designer
      }
    }


    const chatList = Array.from(chatMap.values());
    const designerUserIds = Array.from(chatMap.keys());

    const designers = await Designer.find({ user: { $in: designerUserIds } })
      .populate("user", "username profilePicture role")
      .lean();

    const designerMap = new Map();
    designers.forEach((designer) => {
      if (designer?.user) {
        designerMap.set(designer.user._id.toString(), {
          designerId: designer._id,
          _id: designer.user._id,
          username: designer.user.username,
          profilePicture: designer.user.profilePicture,
          role: designer.user.role,
        });
      }
    });

    const readStatuses = await ReadStatus.find({
      userId,
      partnerId: { $in: designerUserIds },
    }).lean();

    const readMap = new Map();
    readStatuses.forEach((rs) => {
      readMap.set(rs.partnerId.toString(), rs.lastRead);
    });

    // Step 4: Attach designer info
    const enrichedChats = chatList
      .map((msg) => {
        const designerUserId =
          msg.fromModel === "Designer"
            ? msg.from.toString()
            : msg.to.toString();

        const designer = designerMap.get(designerUserId);
        if (!designer) return null;

        return {
          sender: designer?._id,
          _id: msg._id,
          message: msg.message,
          time: msg.time,
          user: designer,
          lastRead: readMap.get(designerUserId) || null,
        };
      })
      .filter(Boolean); 

    res.status(200).json(enrichedChats);
  } catch (error) {
    logger.error("Error fetching user inbox:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAdminInbox = async (req, res) => {
  try {
    const messages = await Message.find().sort({ time: -1 });

    const chatMap = new Map();

    for (const msg of messages) {
      const fromId = msg.from.toString();
      const toId = msg.to.toString();
      const key = fromId < toId ? `${fromId}_${toId}` : `${toId}_${fromId}`;
      if (!chatMap.has(key)) {
        chatMap.set(key, msg);
      }
    }

    const chatList = Array.from(chatMap.values());

    const userIds = new Set();
    const designerIds = new Set();

    for (const msg of chatList) {
      if (msg.fromModel === "UserModel") userIds.add(msg.from.toString());
      if (msg.toModel === "UserModel") userIds.add(msg.to.toString());
      if (msg.fromModel === "Designer") designerIds.add(msg.from.toString());
      if (msg.toModel === "Designer") designerIds.add(msg.to.toString());
    }

    const users = await UserModel.find({
      _id: { $in: Array.from(userIds) },
    }).select("_id username profilePicture");

    const designers = await UserModel.find({
      _id: { $in: Array.from(designerIds) },
    }).select("_id username profilePicture");

    const userMap = new Map();
    users.forEach((u) =>
      userMap.set(u._id.toString(), {
        _id: u._id,
        username: u.username,
        profilePicture: u.profilePicture,
        role: "user",
      })
    );

    const designerMap = new Map();
    designers.forEach((d) => {
      designerMap.set(d._id.toString(), {
        _id: d._id,
        username: d.username,
        profilePicture: d.profilePicture,
        role: "designer",
      });
    });

    const enrichedChats = chatList.map((msg) => {
      const fromId = msg.from.toString();
      const toId = msg.to.toString();

      let from =
        msg.fromModel === "UserModel"
          ? userMap.get(fromId)
          : designerMap.get(fromId);

      let to =
        msg.toModel === "UserModel" ? userMap.get(toId) : designerMap.get(toId);

      // Fallbacks if user/designer deleted
      if (!from) {
        from = {
          _id: msg.from,
          username: "Deleted",
          role: msg.fromModel === "UserModel" ? "user" : "designer",
          profilePicture: "/default-avatar.png",
        };
      }

      if (!to) {
        to = {
          _id: msg.to,
          username: "Deleted",
          role: msg.toModel === "UserModel" ? "user" : "designer",
          profilePicture: "/default-avatar.png",
        };
      }

      return {
        _id: msg._id,
        message: msg.message,
        time: msg.time,
        from,
        to,
      };
    });

    res.status(200).json(enrichedChats);
  } catch (error) {
    logger.error("Failed to fetchi admin inbox:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
