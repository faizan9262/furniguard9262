import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/components/ui/avatar";
import { Badge } from "../components/components/ui/badge";
import { Separator } from "../components/components/ui/separator";
import {
  Calendar,
  Info,
  UserRoundCheck,
  Sofa,
  Download,
  CalendarX2,
  Edit,
  MapPin,
  Wallet,
  DollarSign,
  Percent,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppointment } from "../context/AppointmentsContex";
import { Button } from "@/components/components/ui/button";
import { toast } from "sonner";
import {
  cancelAppointment,
  checkOutPayment,
} from "../helper/api-communicator.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/components/ui/alert-dialog";
import RateComponent from "@/components/RateDialog";
import { MdDelete, MdDeleteOutline, MdPayment } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { TbBulb } from "react-icons/tb";

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const appointment = useAppointment();
  const auth = useAuth();
  const isDesigner = auth?.user?.role === "designer";
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  if (!id)
    return <div className="text-center py-10">No appointment selected.</div>;

  const availableAppointments =
    appointment?.allAppointments?.length > 0
      ? appointment.allAppointments
      : appointment?.DesignerAllAppointments || [];

  const currentAppointment = availableAppointments.find((ap) => ap._id === id);


  const handleCancelAppointment = async () => {
    try {
      toast.loading("Canceling Your Appointment", { id: "cancel-ap" });
      await cancelAppointment(currentAppointment._id, reason);
      toast.success("Appointment Cancelled", { id: "cancel-ap" });
      appointment.removeAppointment(currentAppointment._id);
      navigate("/appointments");
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: "cancel-ap" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">
            Appointment Details
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's everything about your appointment.
          </p>
          {currentAppointment?.status === "pending" &&
            auth.user.role !== "designer" && (
              <div className="flex mt-4 items-start justify-center gap-4 flex-col">
                Pay now to confirm your appointment
                <Button
                  onClick={() =>
                    checkOutPayment(
                      currentAppointment.grandTotal,
                      currentAppointment._id
                    )
                  }
                >
                  Pay Now
                </Button>
              </div>
            )}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`capitalize bg-secondary/20 text-sm px-3 py-1 ${
              currentAppointment?.status === "confirmed"
                ? "bg-primary text-white"
                : "bg-yellow-500"
            }`}
          >
            {currentAppointment?.status || "Penidng"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 bg-primary/20"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:block">Download</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-red-500">
                {currentAppointment?.status !== "completed" ? (
                  <CalendarX2 className="w-4 h-4" />
                ) : (
                  <MdDelete className="w-4 h-4" />
                )}
                <span className="hidden md:block">
                  {currentAppointment?.status !== "completed"
                    ? "Cancel"
                    : "Delete"}
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="text-primary">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {currentAppointment?.status !== "completed"
                    ? "Cancel Appointment"
                    : "Delete Appointment"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-primary-foreground mb-4">
                  Are you sure you want to{" "}
                  {currentAppointment?.status !== "completed"
                    ? "cancel"
                    : "delete"}{" "}
                  this appointment? This action cannot be undone.
                </AlertDialogDescription>

                {/* Reason Textarea */}
                <div>
                  <label
                    htmlFor="reason"
                    className="text-sm font-medium block mb-1"
                  >
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border rounded text-sm text-primary border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Enter reason for cancellation/deletion..."
                  />
                </div>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="text-white border-gray-300 hover:bg-white bg-primary">
                  Go Back
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelAppointment}
                  className="bg-red-500 text-white hover:bg-red-600"
                  disabled={!reason.trim()}
                >
                  Yes,{" "}
                  {currentAppointment?.status !== "completed"
                    ? "Cancel"
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {currentAppointment?.status === "completed" && (
            <RateComponent currentAppointment={currentAppointment} />
          )}
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Appointment Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Payment Status */}
          

          {/* Appointment Date */}
          <p className="text-sm text-muted-foreground">
            {new Date(currentAppointment?.appointmentDate).toLocaleString(
              "en-IN",
              {
                dateStyle: "medium",
                timeStyle: "short",
              }
            )}
          </p>

          {/* Created At */}
          <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Created at{" "}
            <span className="font-medium">
              {new Date(currentAppointment?.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          {/* Appointment Mode */}
          {currentAppointment?.appointmentMode && (
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Mode : {currentAppointment.appointmentMode}
              {currentAppointment.appointmentMode === "Home" &&
                currentAppointment.locationAddress && (
                  <span className="italic text-xs">
                    ({currentAppointment.locationAddress})
                  </span>
                )}
            </div>
          )}

          {/* Products */}
          {currentAppointment?.products?.length > 0 && (
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Sofa className="w-4 h-4 text-primary" />
              <p>
                Products :{" "}
                {currentAppointment.products
                  .map((p) => p.product.name + " [" + p.product.category + "] ")
                  .join(", ")}
              </p>
            </div>
          )}

          {/* GST */}
          {currentAppointment?.designerFee !== 0 && (
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              GST : {currentAppointment?.designerFee}
            </div>
          )}

          {currentAppointment?.gst !== 0 && (
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              GST : {currentAppointment?.gst}
            </div>
          )}

          {/* Discount */}
          {currentAppointment?.discount !== 0 && (
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Discount : {currentAppointment?.discount}
            </div>
          )}

          {/* Grand Total */}
          <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Grand Total : ₹ {currentAppointment?.grandTotal}
          </div>

          {auth.user.role !== "designer" && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm flex items-center justify-center gap-2 font-medium text-muted-foreground">
                <MdPayment className="w-4 h-4 text-primary" /> Payment Status:
              </span>
              {currentAppointment?.status === "confirmed" || currentAppointment?.status === "completed" ? (
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                  ✅ Paid
                </span>
              ) : (
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold animate-pulse">
                  ⏳ Pending
                </span>
              )}
            </div>
          )}

          {/* Notes */}
          {currentAppointment?.notes && (
            <>
              <Separator className="my-4" />
              <p className="text-sm italic text-muted-foreground">
                "{currentAppointment?.notes}"
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* User & Designer Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            onClick={() => {
              navigate("/profile");
            }}
            className="flex items-start gap-4 cursor-pointer"
          >
            <Avatar>
              <AvatarImage src={currentAppointment?.user?.profilePicture} />
              <AvatarFallback>
                {currentAppointment?.user?.username?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg flex items-center gap-1">
                <UserRoundCheck className="w-4 h-4 text-primary" />
                Client
              </CardTitle>
              <p className="text-sm font-medium">
                {currentAppointment?.user?.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentAppointment?.user?.email}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader
            onClick={() => {
              isDesigner
                ? navigate(`/profile`)
                : navigate(`/designers/${currentAppointment?.designer?._id}`);
            }}
            className="flex items-start gap-4 cursor-pointer"
          >
            <Avatar>
              <AvatarImage
                src={currentAppointment?.designer?.user?.profilePicture}
              />
              <AvatarFallback>
                {currentAppointment?.designer?.user?.username?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserRoundCheck className="w-4 h-4 text-primary" />
                Designer
              </CardTitle>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  {currentAppointment?.designer?.user?.username}
                </p>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <Badge
                  variant="default"
                  className="text-xs mt-1 bg-primary/20 text-primary capitalize w-fit"
                >
                  {currentAppointment?.designer?.type}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Experience:{" "}
                  <span className="font-semibold">
                    {currentAppointment?.designer?.experience} yrs
                  </span>
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-secondary">Styles</h1>
        <p className="text-muted-foreground text-sm">
          Here are all styles selected for this appointment.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentAppointment?.products?.map((prod) => (
          <Card
            key={prod._id}
            onClick={() =>
              navigate(`/styles/${prod.product.category}/${prod.product._id}`)
            }
            className="cursor-pointer flex flex-col h-full transition-all hover:shadow-lg"
          >
            <CardHeader className="flex items-center gap-4">
              <Sofa className="text-primary w-6 h-6" />
              <div>
                <CardTitle className="text-xl"> <p className="text-lg text-muted-foreground">
                  {prod.product.name}
                </p></CardTitle>
                <p className="text-sm font-semibold text-secondary">
                  {prod.product.category}
                </p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-grow pt-0">
              <img
                src={prod.product.image}
                alt={prod.product.name}
                className="rounded-xl w-full h-[200px] object-cover"
              />
              <p className="text-sm mt-4 leading-relaxed text-muted-foreground line-clamp-3">
                {prod.product.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-primary/20 my-8 text-primary border-l-[6px] border-primary dark:border-yellow-500/40 px-4 py-3 rounded-lg text-sm">
        <div className="flex items-center gap-1">
          <TbBulb size={18} />
          <p className="font-medium">TIP</p>
        </div>
        {auth.user.role === "user" ? (
          <p>
            You cannot modify or update this Appointment. In case of any mistake
            or want to Update, please
            <span className="font-semibold text-red-600 dark:text-red-400">
              {" "}
              Cancel{" "}
            </span>
            the Appointment and book again.
          </p>
        ) : (
          <p>You cannot modify or update this Appointment. In case of any mistake
            or want to Update, Conatact Admin Please.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailPage;
