const { User, Book } = require("../models");
const { AuthenicationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("books");
      }
      throw new AuthenticationError("Oops! Please login!");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Uh oh! Incorrect email or password.");
      }
      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError("Uh oh! Incorrect email or password.");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Oops! Please login!");
    },
    deleteBook: async (parent, { book }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Oops! Please login!");
    },
  },
};
module.exports = resolvers;
