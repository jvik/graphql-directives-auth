import jwt from "jsonwebtoken";

const adminStrategy = (requestData) => {
  const jsonWebToken = requestData.headers.authorization.replace("Bearer ", "");
  const headers = requestData.headers;
  if (!headers || !headers.authorization) {
    return false;
  }
  jwt.verify(`${jsonWebToken}`, "thisisverysecret");
  console.log(requestData.user);

  if (requestData.user.isActive === true && requestData.user.isAdmin === true) {
    return true;
  }
};

export default adminStrategy;
