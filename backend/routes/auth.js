const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mynameispr@teek'
const fetchuser = require('../middleware/fetchuser')

// Route1: create a user using : POST "/api/auth/createuser".no login required
router.post('/createuser', [
  body('email', 'enter a valid email').isEmail(), // validation
  body('name', 'enter a valid email').isLength({ min: 3 }),
  body('password', 'password must be atleast 5 charcters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  // if there are errors return bad request and return errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  // check whether this email is already existed
  try {
    let user = await User.findOne({ email: req.body.email })
    // checking the users if they already exist if yes the send error
    if (user) {
      return res.status(400).json({ success, errors: "sorry this user already existed" })
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt) // it return promise

    // creating users
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken })
  } catch (error) {
    console.log(error.message);
    res.status(400).json("some errors occured")
  }
})


// Route2: authenticate a user using : POST "/api/auth/login".no login required
router.post('/login', [
  body('email', 'enter a valid email').isEmail(), // validation
  body('password', 'password cannot be blank').exists(),
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      success = false
      return res.status(400).json({ error: "please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "please try to login with correct credentials" })
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true
    res.json({ authToken, success })
    console.log(authToken)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server occured")
  }

})


// Route3: Get logged in user details using : POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server occured")
  }
})


module.exports = router