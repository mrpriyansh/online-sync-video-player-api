const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');

const ContactUs = require('../../models/ContactUs.js');

router.post(
  '/',
  [
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { name, email, description } = req.body;

      try {
        const newContactUs = new ContactUs({
          name,
          email,
          description,
        });

        const aux = await newContactUs.save();
        res.json(aux);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  }
);

module.exports = router;
