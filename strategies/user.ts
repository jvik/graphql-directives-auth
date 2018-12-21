import jwt from "jsonwebtoken";
import adminStrategy from "./admin";

const USER_SECRET = "JsRoundabout";

const userStrategy = (requestData) => {
  const jsonWebToken = requestData.headers.authorization.replace("Bearer ", "");
  const isAdmin = adminStrategy(requestData);
  if (isAdmin) {
    return true;
  }

  const headers = requestData.headers;
  if (!headers || !headers.authorization) {
    return false;
  }

  jwt.verify(`${jsonWebToken}`, "thisisverysecret");
  console.log(requestData.user);

  if (requestData.user.isActive === true) {
    return true;
  }

  const authHeader = headers.authorization;
  return authHeader === USER_SECRET;
};

export default userStrategy;
