const User = require('../model/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

//Generate hashed Password
const hashPassword = async(password, saltRounds, callback) => {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');
  
    // Hash the password with SHA256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
    // Hash the SHA256 password with bcrypt and the salt
    bcrypt.hash(hashedPassword, saltRounds, (err, hash) => {
      if (err) {
        return callback(err);
      }
  
      callback(hash, salt);
    });
  };
  
  // Create a user 
  exports.createUser = async(req, res, next) => {
    const { id, username, email, password, name, role, phone, address, createdAt, updatedAt } = req.body;
  
    await hashPassword(password, 10, (hashedPassword, salt) => {
      const user = {
        id,
        username,
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        address,
        createdAt,
        updatedAt
      };
  
      User.getByColumnValue('username', username, (error, usernameInfo) => {
        if (error) {
          console.error('Error checking username:', error);
          res.status(500).json({ success: false, error: 'Failed to check username' });
          return;
        }
  
        if (usernameInfo) {
          console.log('User with the same username already exists');
          res.status(201).json({ success: false, message: 'User with the same username already exists' });
          return;
        }
  
        User.getByColumnValue('email', email, (error, emailInfo) => {
          if (error) {
            console.error('Error checking email:', error);
            res.status(500).json({ success: false, error: 'Failed to check email' });
            return;
          }
  
          if (emailInfo) {
            console.log('User with the same email already exists');
            res.status(201).json({ success: false, error: 'User with the same email already exists' });
            return;
          }
  
          User.create(user, (error, createdUser) => {
            if (error) {
              console.error('Error creating user:', error);
              res.status(500).json({ success: false, message: 'Failed to create user' });
              return;
            }
  
            res.status(201).json({ success: true, user: createdUser });
          });
        });
      });
    });
  };
  

exports.getAllUsers = (req, res, next) => {
    User.getAll((error, UsersInfo) => {
        if (error) {
            console.error('Error Checking Users Info', error);
            res.status(500).json({ success: false, error: 'Failed to retrieve user details' });
            return;
        }
        res.status(201).json({ success: true, user: UsersInfo });
    })
}

exports.getSingleUser = (req, res, next) => {
    const id = req.params.id;
    User.getById(id,(error, UserInfo) => {
        if (error) {
            console.error('Error Checking User Info', error);
            res.status(500).json({ success: false, error: 'Failed to retrieve user detail' });
            return;
        }
        res.status(201).json({ success: true, user: UserInfo });
    })
}
exports.updateUser = (req, res, next) => {
    const id = req.params.id;
    const updatedData = req.body;
  
    User.update(id, updatedData, (error, success) => {
      if (error) {
        console.error('Error updating user', error);
        res.status(500).json({ success: false, error: 'Failed to update user detail' });
        return;
      }
      if (!success) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User updated successfully' });
    });
  };
  
exports.deleteUser = (req, res, next) => {
   const id =req.params.id;
   User.delete(id,(error,success)=>{
    if (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ success: false, error: 'Failed to delete user detail' });
        return;
    }
    if (!success) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
    }
    res.status(201).json({ success: true, message: 'User deleted Successfully' });
   });

};

exports.loginUser = async(req, res, next) => {
  const email = req.body.email;
  const enteredPassword = req.body.password;

  User.getByColumnValue('email', email, (error, userInfo) => {
    if (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ success: false, error: 'Failed to check email' });
      return;
    }

    if (!userInfo) {
      console.error('User not found');
      res.status(401).json({ success: false, message: 'Please enter a valid email and password' });
      return;
    }
      

    // Compare entered password with stored hashed password
    bcrypt.compare(enteredPassword, userInfo.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords', err);
        res.status(500).json({ success: false, error: 'Failed to compare passwords' });
        return;
      }

      
      if (isMatch) {
        console.log('Login Success');
        res.status(200).json({ success: true, message: 'Login Successful' });
      } else {
        console.error('Wrong Password');
        res.status(401).json({ success: false, message: 'Please enter a valid email and password' });
      }
    });
  });
};
