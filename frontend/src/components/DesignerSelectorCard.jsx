import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import {
  MailIcon,
  PhoneCallIcon,
  PaletteIcon,
  BookOpenIcon,
} from "lucide-react";
import { PiTarget } from "react-icons/pi";
import { motion } from "framer-motion";

const popIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

const DesignerSelectorCard = ({
  designer,
  selectedDesigner,
  setSelectedDesigner,
  selectedDesignerDetails,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Designer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[250px] overflow-y-auto pr-2">
          {designer.designers.map((des) => (
            <motion.div
              key={des.id}
              {...popIn}
              className={`flex flex-col items-center p-3 rounded-xl border transition cursor-pointer hover:bg-muted text-center whitespace-nowrap ${
                selectedDesigner === des
                  ? "border-primary border-2 bg-secondary/10"
                  : "border-border"
              }`}
              onClick={() => setSelectedDesigner(des)}
            >
              <img
                src={des?.user.profilePicture}
                alt={des?.user.username}
                className="w-10 h-10 rounded-full object-cover mb-2"
              />
              <div className="text-xs font-semibold truncate w-full">
                {des?.user.username}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Designer Preview Section (Animated) */}
        {selectedDesignerDetails && (
          <motion.div
            {...popIn}
            className="border mt-6 p-6 rounded-2xl bg-muted space-y-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold text-center text-primary">
              Designer Preview
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Profile Section */}
              <div className="flex flex-col items-center text-center space-y-2">
                <img
                  src={selectedDesignerDetails?.user.profilePicture}
                  alt={selectedDesignerDetails?.user.username}
                  className="w-20 h-20 object-cover rounded-full border shadow"
                />
                <div className="text-lg font-bold text-primary">
                  {selectedDesignerDetails?.user.username}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedDesignerDetails?.title || "Interior Designer"}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    window.location.assign(
                      `/designers/${selectedDesignerDetails.id}`
                    )
                  }
                >
                  View Full Profile
                </Button>
              </div>

              {/* Info Section */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-primary flex gap-1 items-center">
                    <MailIcon size={16} /> Email
                  </p>
                  <p className="text-muted-foreground break-words">
                    {selectedDesignerDetails?.user.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-primary flex items-center gap-1">
                    <PhoneCallIcon size={16} /> Phone
                  </p>
                  <p className="text-muted-foreground break-words">
                    {selectedDesignerDetails?.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-primary flex items-center gap-1">
                    <PiTarget size={16} /> Experience
                  </p>
                  <p className="text-muted-foreground">
                    {selectedDesignerDetails?.experience || "Not mentioned"}+ Years
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-primary flex items-center gap-1">
                    <PaletteIcon size={16} /> Skills
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(selectedDesignerDetails?.expertise?.length > 0
                      ? selectedDesignerDetails?.expertise.slice(0, 2)
                      : []
                    ).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-secondary/20 text-xs px-3 py-1 rounded-full shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="font-semibold text-primary flex items-center gap-1">
                    <BookOpenIcon size={16} /> Bio
                  </p>
                  <p className="text-muted-foreground">
                    {selectedDesignerDetails?.bio?.length > 0
                      ? selectedDesignerDetails?.bio
                      : "No bio available"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DesignerSelectorCard;
