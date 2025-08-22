import React, { useEffect, useState, useMemo } from "react";
import { allPayments } from "../helper/apis";
import { Badge } from "../components/components/ui/badge";
import { Input } from "../components/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/components/ui/select";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const getAllPayments = async () => {
      try {
        const response = await allPayments();
        setPayments(response);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPayments();
  }, []);

  console.log("Payments: ",payments);
  
  // Filter & sort payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search filter
    if (search.trim() !== "") {
      result = result.filter((payment) => {
        const user = payment?.appointment?.user?.username || "";
        const designer = payment?.appointment?.designer?.user?.username || "";
        return (
          user.toLowerCase().includes(search.toLowerCase()) ||
          designer.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [payments, search, sortOrder]);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">Payments</h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 border-r-4 border border-b-4 border-primary/40 rounded-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <Input
              placeholder="Search by User / Designer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full border-none text-primary"
            />
          </div>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-40 border-r-4 border-b-4  border-primary/40 text-primary">
              <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent className="text-primary bg-white">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <p className="text-muted text-center">No payments found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-6 bg-secondary/10 p-3 font-semibold text-sm text-secondary">
            <p>Appointment</p>
            <p>User</p>
            <p>Designer</p>
            <p>Style</p>
            <p className="text-right">Amount</p>
            <p className="text-right">Date</p>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {filteredPayments.map((payment, index) => {
              const user = payment?.appointment?.user;
              const designer = payment?.appointment?.designer?.user;
              const products = payment?.appointment?.products || [];
              const amount = 500 + (500 * 18) / 100; // example calc

              return (
                <motion.div
                  key={payment._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="grid sm:grid-cols-6 gap-2 sm:gap-0 p-3 text-sm hover:bg-gray-50 transition"
                >
                  {/* Mobile stacked view */}
                  <div className="sm:hidden flex flex-col gap-1">
                    <p className="font-medium text-primary">
                      Appointment: {payment?.appointment?._id}
                    </p>
                    <p className="text-muted">User: {user?.username}</p>
                    <p className="text-muted">Designer: {designer?.username}</p>
                    <p className="text-primary">
                      Style:{" "}
                      {products.length > 0
                        ? products.map((p) => p.product?.name).join(", ")
                        : "N/A"}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-green-600 text-white px-3 py-1 rounded-full">
                        ₹{amount}
                      </Badge>
                      <p className="text-muted text-xs">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Desktop table view */}
                  <p className="hidden sm:block truncate font-medium text-primary">
                    {payment?.appointment?._id}
                  </p>
                  <p className="hidden sm:block text-muted truncate">{user?.username}</p>
                  <p className="hidden sm:block truncate text-muted">{designer?.username}</p>
                  <p className="hidden sm:block truncate text-primary">
                    {products.length > 0
                      ? products.map((p) => p.product?.name).join(", ")
                      : "N/A"}
                  </p>
                  <div className="hidden sm:flex justify-end">
                    <Badge className="bg-green-600 text-white px-3 py-1 rounded-full">
                      ₹{amount}
                    </Badge>
                  </div>
                  <p className="hidden sm:block text-right text-muted">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
