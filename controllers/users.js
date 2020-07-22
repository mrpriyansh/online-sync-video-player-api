const User = require('../models/User.js');

const addUser = (socketId, name, room) => {
  // const existingUser = Users.find((user) => user.name === name && user.room === room)
  // if(existingUser) return(error: "error")
  const user = User.findOneAndUpdate({ name }, { $set: { socketId, room } }, { new: true });
  return user;
};

const getUser = socketId => {
  const user = User.findOne({ socketId });
  return user;
};

const removeUser = socketId => {
  const user = User.findOneAndUpdate({ socketId }, { $set: { socketId: '', room: '' } });
  return user;
};

const getUserInRoom = room => {
  const users = User.find({ room });
  return users;
};

module.exports = { addUser, getUser, removeUser, getUserInRoom };
