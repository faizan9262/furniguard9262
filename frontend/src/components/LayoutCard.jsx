import React from "react";
import { Badge } from "./components/ui/badge";
import { Trash2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { deleteProject } from "../helper/api-communicator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./components/ui/alert-dialog";
import { useLocation } from "react-router-dom";

const LayoutCard = ({
  img_scr,
  title,
  onClick,
  tag,
  description,
  duration,
  projectId,
  setProjects,
}) => {
  const auth = useAuth();
  const isDesigner = auth?.user?.role === "designer";

  const path = useLocation()
  const isLayout = path.pathname === "/layout"
  

  const handleDeleteProject = async (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation();
    try {
      toast.loading("Deleting Project From Your Profile", {
        id: "project-delete",
      });
      const res = await deleteProject(projectId);
      setProjects(res.projects);
      toast.success("Project deleted successfully", { id: "project-delete" });
    } catch (error) {
      toast.error("Failed to delete project", { id: "project-delete" });
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col sm:flex-row overflow-visible sm:overflow-hidden rounded-3xl group cursor-pointer transition-all hover:shadow-2xl"
    >
      {/* Background Image */}
      <div className="relative w-full h-60">
        <img
          src={img_scr}
          alt="Layout"
          className="absolute inset-0 w-full h-full object-cover rounded-3xl sm:rounded-none sm:rounded-l-3xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 rounded-3xl sm:rounded-none sm:rounded-l-3xl" />
      </div>

      {/* Content */}
      <div className="relative w-full sm:w-3/5 z-10 sm:-ml-8 -mt-10 sm:mt-0 px-6 sm:px-10 py-6 sm:py-10 rounded-3xl bg-white border border-muted shadow-sm flex flex-col justify-between">
        {/* Delete Button */}
        {isDesigner && !isLayout && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full shadow hover:bg-red-500 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this project from your profile.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-primary/20">
                  Go Back
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-500 text-white"
                  onClick={handleDeleteProject}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Title & Tag */}
        <div>
          <h2 className="text-lg  font-semibold text-primary line-clamp-2">
            {title}
          </h2>
          <div className="mt-2">
            <Badge className="bg-primary/20 text-black text-xs">{tag}</Badge>
          </div>
        </div>

        {/* Duration & Description */}
        {duration?.length > 0 && (
          <p className="text-sm text-secondary leading-relaxed mt-4">
            Duration: {duration}
          </p>
        )}
        <p className="text-xs text-secondary leading-relaxed mt-2 line-clamp-2">
          {description}
        </p>

        {/* Decorative Corner */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-primary/10 rotate-45 rounded-lg" />
      </div>
    </div>
  );
};

export default LayoutCard;
