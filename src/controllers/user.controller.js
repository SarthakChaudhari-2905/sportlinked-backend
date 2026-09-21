import { updateCurrentUser } from "../services/user.service.js";

const updateMe = async (req, res) => {
  const user = await updateCurrentUser(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
};

export { updateMe };

