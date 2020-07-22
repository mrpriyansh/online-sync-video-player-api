const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');

const Contact = require('../../models/ContactUs.js');

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ msg: errors.array()[0].msg });
    } else {
      const { name, email, description } = req.body;
      try {
        const newContact = new Contact({
          name,
          email,
          description,
        });

        await newContact.save();
        res.json(newContact);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  }
);

module.exports = router;
