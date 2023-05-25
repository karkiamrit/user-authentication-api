const User = require('../model/userModel');
const crypto = require('crypto');


// Generate hashed Password
const hashPassword = (password, salt) => {
  const hashedPassword = crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex'); // Hash the password with the salt

  return hashedPassword;
};


// Create a user
exports.createUser = async (req, res, next) => {
  const { id, username, email, password, name, role, phone, address, createdAt, updatedAt } = req.body;

  try {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hashedPassword = hashPassword(password, salt); // Hash the password with the salt

    const user = {
      id,
      username,
      email,
      password: `${salt}:${hashedPassword}`, // Combine salt and hashed password
      name,
      phone,
      role,
      address,
      createdAt,
      updatedAt,
    };

    const usernameInfo = await User.getByColumnValue('username', username);
    if (usernameInfo) {
      console.log('User with the same username already exists');
      return res.status(201).json({ success: false, message: 'User with the same username already exists' });
    }

    const emailInfo = await User.getByColumnValue('email', email);
    if (emailInfo) {
      console.log('User with the same email already exists');
      return res.status(201).json({ success: false, error: 'User with the same email already exists' });
    }

    const createdUser = await User.create(user);
    res.status(201).json({ success: true, user: createdUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const UsersInfo = await User.getAll();
    res.status(201).json({ success: true, user: UsersInfo });
  } catch (error) {
    console.error('Error Checking Users Info', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user details' });
  }
};

exports.getSingleUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const UserInfo = await User.getById(id);
    res.status(201).json({ success: true, user: UserInfo });
  } catch (error) {
    console.error('Error Checking User Info', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user detail' });
  }
};

exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const success = await User.update(id, updatedData);
    if (!success) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user', error);
    res.status(500).json({ success: false, error: 'Failed to update user detail' });
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const success = await User.delete(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(201).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).json({ success: false, error: 'Failed to delete user detail' });
  }
};

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const enteredPassword = req.body.password;

  try {
    const userInfo = await User.getByColumnValue('email', email);

    if (!userInfo) {
      console.error('User not found');
      res.status(401).json({ success: false, message: 'Please enter a valid email and password' });
      return;
    }

    const storedPassword = userInfo.password; // Get the stored password from the user object
    const [salt, hashedPassword] = storedPassword.split(':'); // Split the stored password to extract the salt and hashed password

    const isMatch = hashPassword(enteredPassword, salt) === hashedPassword;

    if (isMatch) {
      console.log('Login Success');
      res.status(200).json({ success: true, message: 'Login Successful' });
    } else {
      console.error('Wrong Password');
      res.status(401).json({ success: false, message: 'Please enter a valid email and password' });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ success: false, error: 'Failed to check email' });
  }
};
