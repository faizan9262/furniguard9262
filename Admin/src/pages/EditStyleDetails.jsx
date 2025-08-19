import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { Input } from "../components/components/ui/input";
import { Textarea } from "../components/components/ui/textarea";
import { Button } from "../components/components/ui/button";
import { Label } from "../components/components/ui/label";
import { Card, CardContent } from "../components/components/ui/card";
import { updateStyle } from "../helper/apis"; // ✅ Import here
import { toast } from "sonner";

const EditStyleDetails = () => {
  const { list, setList } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();

  const product = list.find((p) => p._id === id);

  console.log("Product : ",product.image);
  

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    image: product?.image || "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
        image: URL.createObjectURL(file),
      }));
    }
  };

  console.log("File: ",formData.image);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Updating styles", { id: "update" });
      const response = await updateStyle(
        id,
        formData.name,
        formData.description,
        formData.category,
        formData.file // send file, backend will upload to Cloudinary
      );

      setList((prevList) =>
        prevList.map((item) =>
          item._id === id ? { ...item, ...response } : item
        )
      );

        console.log("Resposne: ",response);

      navigate(`/styles/${response.category}/${response._id}`);
    } catch (err) {
      toast.error("Can't update this product, try again.", { id: "update" });
      console.error(err);
    } finally {
      toast.success("Styles updated.", { id: "update" });
    }
  };

  if (!product) {
    return (
      <div className="p-6 text-center text-lg font-semibold text-red-500">
        Product not found.
      </div>
    );
  }

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url(${formData.image || product.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dark + Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {/* Page Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="relative h-80 w-full flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={formData.image || product.image}
              alt="Product"
              className="w-72 h-52 md:w-96 md:h-72 object-cover rounded-xl border-4 border-white shadow-xl"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition"
            >
              <Pencil size={18} className="text-gray-700" />
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </motion.div>
        </div>

        {/* Form Section */}
        <h1 className="text-center text-xl text-white font-bold my-4">
          Update Styles Here
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto w-full"
        >
          {/* Left Column */}
          <div className="bg-white backdrop-blur-lg rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <Label className="text-primary">Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-primary/10 text-primary border-0"
              />
            </div>
            <div>
              <Label className="text-primary">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                className="bg-primary/10 text-primary border-0"
              />
            </div>
            <div>
              <Label className="text-primary">Category</Label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="bg-primary/10 text-primary border-0"
              />
            </div>
          </div>

          {/* Preview Column */}
          <motion.div
            className="bg-white backdrop-blur-lg rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-80 border-none bg-primary/10 shadow-lg">
              <img
                src={formData.image || product.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="p-4 space-y-1">
                <h2 className="font-semibold text-lg text-primary">
                  {formData.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {formData.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </form>

        {/* Bottom Bar */}
        <div className="sticky bottom-0 bg-white backdrop-blur-md shadow-inner py-4 px-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex bg-red-600 border-0 hover:bg-red-500 hover:text-white items-center gap-2"
          >
            <XCircle size={18} /> Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex bg-primary text-white items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {!loading && <CheckCircle2 size={18} />}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditStyleDetails;
