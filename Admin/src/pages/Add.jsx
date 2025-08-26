import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LuImageUp } from "react-icons/lu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/components/ui/card";
import { Input } from "../components/components/ui/input";
import { Label } from "../components/components/ui/label";
import { Button } from "../components/components/ui/button";
import { Textarea } from "../components/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/components/ui/select";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddProduct = () => {
  const [product_img, setProduct_Img] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("flooring");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Adding Style...", { id: "addProduct" });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      if (product_img) {
        formData.append("product_img", product_img);
      }

      const response = await axios.post(
        backendUrl + "/api/products/add",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Style added successfully", { id: "addProduct" });
        setName("");
        setDescription("");
        setProduct_Img(null);
        navigate("/styles");
      } else {
        toast.error(response.data.message, { id: "addProduct" });
      }
    } catch (error) {
      toast.error("Something went wrong while adding style.", {
        id: "addProduct",
      });
    }
  };

  const removeImage = () => {
    setProduct_Img(null);
  };

  return (
    <div className="min-h-screen bg-[#f5fdf9] px-4 sm:px-10 py-10 flex flex-col items-center">
      <Card className="w-full max-w-3xl border border-muted-foreground/20 shadow-sm">
        <form onSubmit={onSubmitHandler}>
          <CardHeader>
            <CardTitle className="text-primary text-2xl">
              Add New Style
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-2 text-primary">
              <Label htmlFor="product_img">Style Image</Label>
              <div className="flex gap-4">
                {product_img && (
                  <div className="w-28 h-28 relative group">
                    <img
                      src={URL.createObjectURL(product_img)}
                      alt="preview"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs p-1 hidden group-hover:flex"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {!product_img && (
                  <label
                    htmlFor="product_img"
                    className="w-28 h-28 flex items-center justify-center border border-dashed rounded-md cursor-pointer hover:bg-primary/10 transition"
                  >
                    <LuImageUp className="text-muted-foreground text-2xl" />
                    <input
                      id="product_img"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setProduct_Img(e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-2 text-primary">
              <Label htmlFor="name">Style Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Luxury Wooden Chair"
                required
              />
            </div>

            <div className="grid gap-2 text-primary">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed style description..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2 text-primary">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-primary">
                    <SelectItem value="flooring">Flooring</SelectItem>
                    <SelectItem value="livingroom">Living Room</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="stairs">Stairs</SelectItem>
                    <SelectItem value="lights">Lights</SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="layout">Layout</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="wallpaper">Wallpaper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-6">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary-foreground"
            >
              Add Style
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
