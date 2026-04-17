const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const rpID = 'localhost';
const origin = `http://${rpID}:5173`;

// --- Standard Login ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const token = signToken(user._id);
    user.password = undefined;
    res.json({ status: 'success', token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Self-Service Password Update ---
router.patch('/update-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(oldPassword, user.password))) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Admin Reset Manager Password ---
router.patch('/reset-user-password/:id', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.password = newPassword;
    await user.save();
    res.json({ status: 'success', message: `Password for ${user.name} has been reset` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- WebAuthn Registration (Options) ---
router.post('/register-biometric-options', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  
  const options = await generateRegistrationOptions({
    rpName: 'JAC Import Dashboard',
    rpID,
    userID: user._id.toString(),
    userName: user.email,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  user.currentChallenge = options.challenge;
  await user.save();

  res.json(options);
});

// --- WebAuthn Registration (Verify) ---
router.post('/register-biometric-verify', async (req, res) => {
  const { userId, body } = req.body;
  const user = await User.findById(userId);

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified) {
    const { registrationInfo } = verification;
    user.credentials.push({
      credentialID: registrationInfo.credentialID,
      publicKey: registrationInfo.credentialPublicKey,
      counter: registrationInfo.counter,
    });
    await user.save();
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
});

// --- WebAuthn Login (Options) ---
router.post('/login-biometric-options', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.credentials.map(c => ({
      id: c.credentialID,
      type: 'public-key',
    })),
    userVerification: 'preferred',
  });

  user.currentChallenge = options.challenge;
  await user.save();

  res.json(options);
});

// --- WebAuthn Login (Verify) ---
router.post('/login-biometric-verify', async (req, res) => {
  const { email, body } = req.body;
  const user = await User.findOne({ email });

  const dbCred = user.credentials.find(c => c.credentialID.toString('base64url') === body.id);
  
  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: dbCred.credentialID,
      credentialPublicKey: dbCred.publicKey,
      counter: dbCred.counter,
    },
  });

  if (verification.verified) {
    const token = signToken(user._id);
    res.json({ status: 'success', token, user });
  } else {
    res.status(400).json({ verified: false });
  }
});

module.exports = router;
