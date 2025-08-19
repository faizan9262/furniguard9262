import React from "react";
import { Card } from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { Eye, HeartOff } from "lucide-react";

const WishlistCard = ({
  title,
  description,
  img_src,
  price,
  category,
  onView,
  onRemove,
}) => {
  return (
    <Card className="w-full bg-white max-w-md border shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* Header Strip */}
      <div className="w-full bg-primary px-4 py-2 text-white text-sm font-medium flex justify-between items-center">
        <span className="truncate">{title}</span>
        <Badge className="bg-secondary/90 rounded-full text-white text-xs">{category}</Badge>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row gap-4 p-3">
        {/* Image */}
        <div className="w-full m:w-32 h-52 rounded-lg overflow-hidden border">
          <img
            src={img_src}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2 px-4 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-primary text-primary hover:text-white transition-all duration-300"
          onClick={onView}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button
          variant="destrctive"
          size="sm"
          className="flex-1 text-white bg-red-500 hover:bg-red-600"
          onClick={onRemove}
        >
          <HeartOff className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>
    </Card>
  );
};

export default WishlistCard;
