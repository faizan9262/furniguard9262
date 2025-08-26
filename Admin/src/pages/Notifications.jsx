import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { Input } from "../components/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/components/ui/avatar";
import { Skeleton } from "../components/components/ui/skeleton";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GrUserWorker } from "react-icons/gr";
import adminSocket from "../adminSocket";
import { FaBell } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { toast } from "sonner";

const Notifications = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`/message/get-all`);
        setChats(res.data);
      } catch (err) {
        toast.error("Failed to fetch admin inbox");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const handleNewMessage = (data) => {
      setChats((prevChats) => {
        const alreadyExists = prevChats.some((chat) => chat._id === data._id);
        if (!alreadyExists) return [data, ...prevChats];
        return prevChats.map((chat) => (chat._id === data._id ? data : chat));
      });
    };

    adminSocket.on("receive-message", handleNewMessage);

    return () => {
      adminSocket.off("receive-message", handleNewMessage);
    };
  }, []);

  const filteredChats = chats
    .filter(
      (chat) =>
        chat.from?.username?.toLowerCase().includes(search.toLowerCase()) ||
        chat.to?.username?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      return sort === "new"
        ? new Date(b.time) - new Date(a.time)
        : new Date(a.time) - new Date(b.time);
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-b-4 border-r-4 border-primary/40 rounded-lg text-primary"
          />
          <select
            className="border-b-4 border-r-4 border-primary/40 border rounded-lg text-primary text-sm px-2 focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredChats.length === 0 ? (
        <p className="text-muted-foreground text-center">No messages found</p>
      ) : (
        <div className="space-y-4">
          {filteredChats.map((chat) => (
            <div
              onClick={() =>
                navigate(`/chat/${chat?.to?._id}/${chat?.from?._id}`, {
                  state: {
                    user: {
                      name: chat?.to?.username,
                      profilePicture: chat?.to?.profilePicture,
                      _id: chat?.to?._id,
                    },
                    designer: {
                      name: chat?.from?.username,
                      profilePicture: chat?.from?.profilePicture,
                      _id: chat?.from?._id,
                    },
                  },
                })
              }
              key={chat._id}
              className="p-4 flex items-center justify-between shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform cursor-pointer duration-300 bg-primary/20 rounded-xl"
            >
              {/* Left Section */}
              <div className="flex items-center gap-8">
                <div className="relative w-12 h-12">
                  <Avatar className="absolute left-0 top-0 z-10 border-2 border-white">
                    <AvatarImage
                      src={chat.from?.profilePicture || "/default-avatar.png"}
                      alt={chat.from?.username}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Avatar className="absolute left-5 top-0 z-0 border-2 border-white">
                    <AvatarImage
                      src={chat.to?.profilePicture || "/default-avatar.png"}
                      alt={chat.to?.username}
                    />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex gap-1">
                  <p className="text-sm font-semibold text-primary flex items-center gap-1">
                    {chat.from?.role === "designer" && (
                      <GrUserWorker className="w-4 h-4 text-muted-foreground" />
                    )}
                    {chat.from?.role === "user" && (
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                    {chat.from?.username}
                  </p>
                  <p className="text-sm font-semibold mx-1 flex items-center justify-center text-green-500">
                    <FaArrowRightArrowLeft size={12} />
                  </p>
                  <p className="text-sm font-semibold text-primary flex items-center gap-1">
                    {chat.to?.role === "designer" && (
                      <GrUserWorker className="w-4 h-4 text-muted-foreground" />
                    )}
                    {chat.to?.role === "user" && (
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                    {chat.to?.username}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right max-w-xs">
                <p className="text-sm text-primary truncate">{chat.message}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNowStrict(new Date(chat.time), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
