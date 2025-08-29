import React from "react";
import { Card, CardContent } from "../components/components/ui/card";
import { Badge } from "../components/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/components/ui/avatar";
import {
  CalendarClockIcon,
  CircleCheckBig,
  CircleDashed,
  CheckCircle2,
} from "lucide-react";

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return {
        bg: "bg-green-500",
        icon: <CircleCheckBig className="w-4 h-4" />,
        label: "Confirmed",
      };
    case "completed":
      return {
        bg: "bg-blue-600",
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Completed",
      };
    default:
      return {
        bg: "bg-yellow-500",
        icon: <CircleDashed className="w-4 h-4" />,
        label: "Pending",
      };
  }
};

const AppointmentCard = ({
  user,
  designer,
  product,
  date,
  status,
  notes,
  onClick,
}) => {
  const { bg, icon, label } = getStatusStyles(status);

  return (
    <Card
      onClick={onClick}
      className="group flex items-start gap-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer p-4 sm:p-3 rounded-3xl"
    >
      {/* Product Preview */}
      <div className="w-full gap-4 flex flex-col">
        <img
          src={product[0]?.product?.image}
          alt={product[0]?.product?.title}
          className="w-full h-32 md:h-52 object-cover rounded-xl"
        />
        <div className="w-full flex flex-col gap-1 justify-start">
          <h3 className="text-sm md:text-xl font-normal text-primary line-clamp-1">
            {product[0]?.product?.name?.charAt(0).toUpperCase() +
              product[0]?.product?.name?.slice(1)}
          </h3>
          <div className="flex items-center justify-start gap-1">
            <Badge className="text-primary text-[8px] md:text-xs bg-primary/10">
              {product[0]?.product?.category?.charAt(0).toUpperCase() +
                product[0]?.product?.category?.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 w-full flex flex-col gap-2 md:gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
          <div className="flex w-full flex-col gap-2 justify-between">
            <div className="flex md:flex-col gap-2 justify-center md:justify-start">
              {/* Date Badge */}
              <div className="flex items-center justify-start gap-1">
                <CalendarClockIcon className="w-3 h-3 md:h-4 md:w-4 text-primary" />
                <Badge className="text-primary text-[8px] md:text-xs bg-primary/10">
                  {new Date(date).toLocaleDateString("en-GB")}
                </Badge>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center px-1 md:p-1 justify-center rounded-full text-white ${bg}`}
              >
                {icon}
                <Badge className="bg-transparent text-white hidden md:block">
                  {label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-between">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 md:h-8 md:w-8">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[8px] md:text-sm font-medium text-primary">
                {user?.username}
              </p>
              <p className="text-[8px] md:text-xs text-muted-foreground">Client</p>
            </div>
          </div>

          {/* Designer Info */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 md:h-8 md:w-8">
              <AvatarImage src={designer?.user?.profilePicture} />
              <AvatarFallback>{designer?.user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[8px] md:text-sm font-medium text-primary">
                {designer?.user?.username}
              </p>
              <p className="text-[8px] md:text-sm text-muted-foreground line-clamp-1">
                {designer?.type.charAt(0).toUpperCase() + designer?.type.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
