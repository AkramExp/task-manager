import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.userToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const userId = decoded.userId;

    req.userId = userId;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized access" });
  }
};

export default verifyUser;
