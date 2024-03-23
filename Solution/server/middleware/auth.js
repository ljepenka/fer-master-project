import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET || "");
      req.userId = data?.id;
    }

    next();
  } catch (error) {
    console.log(error);
    if (error.name !== "TypeError") {
      return res.status(401).send({ error: `Unable to grant access: ${error.message}` });
    } else {
      return res.status(500).send({ error: `Something went wrong` });
    }
  }
};

export default auth;
