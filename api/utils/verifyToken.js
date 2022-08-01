import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// This verifies that is the token correct i.e. weather person is admin or not
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    //  Here in place of the req.user you can write any property as nothing is defined in request
    req.user = user;
    console.log(req.user);
    next();
  });
};

// To verify the user
export const verifyUser = (req, res, next) => {
  // If the user have the token i.e. user needs to be authenticated.
  verifyToken(req, res, next, () => {
    // If the user id matches or user is admin then CRUD operations can be performed.
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};