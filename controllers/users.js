const User = require('../models/User.js');

const addUser = async (socketId, userId, room) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { socketId, room } },
      { new: true }
    );
    console.log('Add: ', socketId);
    return { user: { name: user.name, room: user.room } };
  } catch (err) {
    console.log(err);
    return { err };
  }
};

const getUser = async socketId => {
  try {
    const user = await User.findOne({ socketId });
    return { user: { name: user.name, room: user.room } };
  } catch (err) {
    console.log(err);
    return { err };
  }
};

const removeUser = async socketId => {
  try {
    const user = await User.findOneAndUpdate({ socketId }, { $set: { socketId: '', room: '' } });
    console.log('Remove: ', socketId);
    return { user: { name: user.name, room: user.room } };
  } catch (err) {
    console.log(err);
    return { err };
  }
};

// const getUserInRoom = room => {
//   const users = User.find({ room });
//   return users;
// };

module.exports = { addUser, getUser, removeUser };
