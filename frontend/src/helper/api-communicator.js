import axios from "axios";
import { assets } from "../assets/assets";
import { toast } from "sonner";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("/user/login", { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while Signing In");
    }
  }
};

export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post("/user/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while  Signing Up");
    }
  }
};

export const authStatus = async () => {
  try {
    const response = await axios.get("/user/is-auth");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while Authentication");
    }
  }
};

export const sendVerifyEmailOtp = async () => {
  try {
    const response = await axios.get("/user/send-email-otp");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Something went wrong while sending email verification OTP"
      );
    }
  }
};

export const verifyEmailOtp = async (otp) => {
  try {
    const response = await axios.post("/user/verify-email-otp", { otp });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Something went wrong while Verifying Email verification OTP"
      );
    }
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post("/user/logout");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while Log out");
    }
  }
};

export const sendPasswordResetMail = async (email) => {
  try {
    const response = await axios.post("/user/forgot-password", { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while password reset link");
    }
  }
};

export const resetPassword = async (otp, newPassword, email) => {
  try {
    const response = await axios.post(`/user/reset-password`, {
      otp,
      newPassword,
      email,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while password reset");
    }
  }
};

export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.post(`/user/update-password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while updating password");
    }
  }
};

export const updateProfile = async (formdata) => {
  try {
    const response = await axios.post(`/user/update-profile-pic`, formdata);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong while updating profile pic");
    }
  }
};

// Wishlist

export const getAllWishlistProducts = async () => {
  const response = await axios.get("/wishlist/get-all");
  if (response.status !== 200) {
    throw new Error("Unable to Load All wishlist Products");
  }

  return response;
};

export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post("/wishlist/add", { productId });
    return response.data;
  } catch (error) {
    // Forward backend's message if available
    const message =
      error?.response?.data?.message || "Unable to add product in wishlist";
    throw new Error(message);
  }
};

export const removeFromWishlist = async (productId) => {
  const response = await axios.post("/wishlist/remove", { productId });
  if (response.status !== 200) {
    throw new Error("Unable to remove product from wishlist");
  }
  return response;
};

// Ratings

export const submitCombinedRating = async (ratingData, designerId) => {
  try {
    const payload = {
      designer: {
        targetId: designerId,
        rating: ratingData.designerRating,
        reviewText: ratingData.feedback,
      },
      products: Object.keys(ratingData.productRatings).map((productId) => ({
        targetId: productId,
        rating: ratingData.productRatings[productId],
        reviewText: ratingData.productFeedbacks[productId] || "",
      })),
    };

    const response = await axios.put("/ratings/rate", payload);

    if (response.status !== 200) {
      throw new Error("Unable to submit ratings");
    }
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to submit ratings";
    throw new Error(message);
  }
};

export const getDesignerRating = async (designerId) => {
  const response = await axios.get(`/ratings/designer/${designerId}`);
  if (response.status !== 200) {
    throw new Error("Unable to Load Designer Ratings");
  }
  const data = await response.data;
  return data;
};
export const getProductRating = async (productId) => {
  const response = await axios.get(`/ratings/product/${productId}`);
  if (response.status !== 200) {
    throw new Error("Unable to Load Product Ratings");
  }
  const data = await response.data;
  return data;
};

// Products Apis

export const getProductsByPage = async (page, excludeIds = []) => {
  const query = new URLSearchParams({
    page: page,
    limit: 20,
    exclude: excludeIds.join(","), // Pass previously loaded IDs
  });

  const response = await axios.get(`/products/user-list?${query.toString()}`);
  if (response.status !== 200) throw new Error("Unable to Load Products");

  return response.data.ratedProducts;
};

// Designer Apis

export const getAllDesigners = async () => {
  const response = await axios.get("/designers/all-designers");
  if (response.status !== 200) {
    throw new Error("Unable to Load All Designers");
  }
  const data = await response.data;
  return data;
};

export const editDesignerProfile = async (formdata) => {
  const response = await axios.post("/designers/update-profile", formdata);

  if (response.status !== 200) {
    throw new Error("Unable to Update your Profile.");
  }

  return response.data;
};

export const addProject = async (formdata) => {
  const response = await axios.post("/designers/add-project", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.status !== 200) {
    throw new Error("Unable to Add Project.");
  }

  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await axios.post("/designers/project/delete", { projectId });

  if (response.status !== 200) {
    throw new Error("Unable to Delete Project.");
  }

  return response.data;
};

// Appointment Apis

export const getAllAppointments = async () => {
  const response = await axios.get("/appointment/get-all");
  if (response.status !== 200) {
    throw new Error("Unable to Load All Appointments");
  }
  const data = await response.data;
  return data;
};

export const getAllAppointmentsOfDesigner = async () => {
  const response = await axios.get("/appointment/designer/get-all");
  if (response.status !== 200) {
    throw new Error("Unable to Load All Appointments");
  }
  const data = await response.data;
  return data;
};

export const createNewAppointment = async ({ appointmentData }) => {
  const response = await axios.post(
    "/appointment/new-booking",
    appointmentData
  );
  if (response.status !== 201) {
    throw new Error("Unable Book Appointment");
  }
  const data = await response.data;
  return data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await axios.post("/appointment/cancel", { appointmentId });
  if (response.status !== 200) {
    throw new Error("Unable Cancel Appointment");
  }
  const data = await response.data;
  return data;
};


// Chats and messages

export const getUserInbox = async (userRole, userId) => {
  const response = await axios.get(`/message/inbox/${userRole}/${userId}`);
  if (response.status !== 200) {
    throw new Error("Unable To Load Chats");
  }
  const data = await response.data;
  return data;
};


export const fetchMessages = async (from, receiverId) => {
  const response = await axios.get(`/message/convo/${from}/${receiverId}`);
  if (response.status !== 200) {
    throw new Error("Unable To Load Messages");
  }
  const data = await response.data;
  return data;
};

export const checkOutPayment = async (amount,appointmentId) => {
  const { data: { key } } = await axios.get('/payment/get-key');

  const { data: order } = await axios.post('/payment/checkout', { amount });


  const options = {
    key,
    amount: order.amount,
    currency: 'INR',
    name: 'FurniGuard Pvt Ltd',
    description: 'Payment to FurniGuard',
    image: assets.logo,
    order_id: order.id,
    prefill: {
      name: 'Fzee Shaikh',
      email: 'fzee.shaikh@example.com',
      contact: '9898989898'
    },
    notes: {
      address: 'FurniGuard Studio Mumbai'
    },
    theme: {
      color: '#BC8A5F'
    },
    handler: async function (response) {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

      try {
        const verifyRes = await axios.post('/payment/verification', {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          appointmentId
        });

        if (verifyRes.data.success) {
          window.location.href = `/appointments`;
        } else {
          alert("Payment verification failed: Invalid signature");
        }
      } catch (err) {
        toast.error("Payment verification failed:", err.response?.data || err.message);
        alert("Payment verification failed");
      }
    },
    modal: {
      ondismiss: function () {
        toast.info("Payment popup dismissed");
      }
    }
  };

  const razor = new window.Razorpay(options);
  razor.open(); // open only when you’re ready to show payment

  return order;
};

