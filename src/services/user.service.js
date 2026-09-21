import User from "../models/User.js";

const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "avatar",
  "phone",
];

const updateCurrentUser = async (userId, data) => {
  const updates = {};

  for (const field of ALLOWED_FIELDS) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export { updateCurrentUser };

