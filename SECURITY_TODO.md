# 🔐 Security TODO - Optics Glasses Backend

> **Generated:** 2026-02-05
> **Status:** Not Production Ready
> **Current Grade:** C+

---

## 🚨 CRITICAL (Must Fix Before Production)

### 1. [ ] Strengthen JWT SECRET_KEY
**File:** `.env`
**Current Issue:** Only 10 characters - easily brute-forceable
**Fix:**
```bash
# Generate a strong secret (64+ characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
**Requirements:**
- Minimum 256-bit (32 bytes / 64 hex chars) random key
- Never commit to Git
- Use environment variables on Vercel/production directly

---

### 2. [ ] Hash OTP Before Storing
**Files:** `services/userServices.js`, `models/User.js`
**Current Issue:** OTP is stored in plain text in database
**Fix:**
```javascript
// Before saving OTP
const hashedOTP = await bcrypt.hash(otp, 10);
user.otp = hashedOTP;

// When verifying OTP
const isMatch = await bcrypt.compare(submittedOTP, user.otp);
if (!isMatch) throw new Error("Invalid verification code");
```

---

### 3. [ ] Add Rate Limiting
**Files:** `server.js`, `Routes/userRoutes.js`
**Current Issue:** No rate limiting on any endpoints
**Install:**
```bash
npm install express-rate-limit
```
**Fix:**
```javascript
const rateLimit = require('express-rate-limit');

// General API limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { isStatus: false, msg: 'Too many requests' }
});

// Login limiter (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { isStatus: false, msg: 'Too many login attempts' }
});

// OTP limiter
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { isStatus: false, msg: 'Too many attempts' }
});

// Resend OTP limiter (1 per minute)
const resendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
});

// Apply to routes
router.post("/login", loginLimiter, getUserController);
router.post("/verify-otp", otpLimiter, verifyOTPController);
router.post("/resend-otp", resendLimiter, resendOTPController);
router.post("/forgot-password", rateLimit({ windowMs: 60000, max: 3 }), forgotPasswordController);
```

---

### 4. [ ] Remove Sensitive Console Logs
**Files:** `middleware/authMiddleware.js`, `controllers/userController.js`, all services
**Current Issue:** Tokens and sensitive data logged to console
**Fix:**
- Remove all `console.log` statements with sensitive data
- OR use environment-based logging:
```javascript
const isDev = process.env.NODE_ENV === 'development';
if (isDev) console.log('Debug info');
```
- Consider using a proper logger like `winston` or `pino`

**Files to check:**
- [ ] `middleware/authMiddleware.js` - Lines 18, 22, 24, 29, 37, 85, 93, 100
- [ ] `controllers/userController.js` - Line 162
- [ ] All service files

---

## ⚠️ MAJOR (High Priority)

### 5. [ ] Add Password Complexity Validation
**File:** `services/userServices.js`
**Current Issue:** Only checks minimum length (8 chars)
**Fix:**
```javascript
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!hasUpperCase || !hasLowerCase) {
    throw new Error('Password must contain uppercase and lowercase letters');
  }
  if (!hasNumbers) {
    throw new Error('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    throw new Error('Password must contain at least one special character');
  }
};

// Use in createUser and changePassword
validatePassword(password);
```

---

### 6. [ ] Implement Token Blacklisting
**New Files:** `utils/tokenBlacklist.js`, or use Redis
**Current Issue:** Logged out tokens are still valid until expiry
**Options:**

**Option A - Redis (Recommended for production):**
```bash
npm install ioredis
```
```javascript
// utils/redis.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// On logout
await redis.set(`blacklist:${token}`, 'true', 'EX', 7 * 24 * 60 * 60);

// In verifyToken middleware
const isBlacklisted = await redis.get(`blacklist:${token}`);
if (isBlacklisted) return res.status(401).json({ msg: 'Token revoked' });
```

**Option B - In-memory (Simple, not for multi-instance):**
```javascript
// utils/tokenBlacklist.js
const blacklist = new Set();

module.exports = {
  add: (token) => blacklist.add(token),
  has: (token) => blacklist.has(token),
  // Clean old tokens periodically
};
```

---

### 7. [ ] Reduce JWT Payload
**File:** `services/userServices.js`
**Current Issue:** JWT contains mutable data (username, email, phone, name)
**Fix:**
```javascript
// Before (problematic)
const token = signToken({
  id: user._id,
  username: user.username,
  email: user.email,
  name: user.name,
  phone: user.phone,
});

// After (recommended)
const token = signToken({ id: user._id });

// Then fetch fresh user data in getProfileController
```

---

### 8. [ ] Add CSRF Protection
**File:** `server.js`
**Install:**
```bash
npm install csurf
```
**Fix:**
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Apply to state-changing routes
app.use('/api/users', csrfProtection);
app.use('/api/orders', csrfProtection);

// Send CSRF token to frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

---

### 9. [ ] Reduce Cookie Max Age
**File:** `controllers/userController.js`
**Current Issue:** 7-day token lifetime is very long
**Fix:**
```javascript
// Option A: Shorter session (recommended)
maxAge: 2 * 60 * 60 * 1000, // 2 hours

// Option B: Implement refresh tokens
// Access token: 15 minutes
// Refresh token: 7 days (stored in httpOnly cookie, separate endpoint)
```

---

## 📋 MODERATE (Should Fix)

### 10. [ ] Use Generic Error Messages
**Files:** `services/userServices.js`, `controllers/userController.js`
**Current Issue:** Reveals whether email/phone exists
**Fix:**
```javascript
// Before
if (existingUser.email === email) throw new Error("Email already registered");
if (existingUser.phone === phone) throw new Error("Phone number already registered");

// After
throw new Error("An account with these credentials already exists");
```

---

### 11. [ ] Implement Account Lockout
**Files:** `models/User.js`, `services/userServices.js`
**Fix:**
```javascript
// Add to User model
failedLoginAttempts: { type: Number, default: 0 },
lockedUntil: { type: Date, default: null }

// In getUser service
if (user.lockedUntil && user.lockedUntil > new Date()) {
  throw new Error('Account temporarily locked. Try again later.');
}

// On failed login
user.failedLoginAttempts += 1;
if (user.failedLoginAttempts >= 5) {
  user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
}
await user.save();

// On successful login
user.failedLoginAttempts = 0;
user.lockedUntil = null;
await user.save();
```

---

### 12. [ ] Fix Timing Attack in Forgot Password
**File:** `services/userServices.js`
**Current Issue:** Response time differs if user exists
**Fix:**
```javascript
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  
  // Always perform operations regardless of user existence
  if (user) {
    const token = tempToken({ id: user._id, username: user.username });
    const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, { resetLink });
  } else {
    // Simulate the same delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Never reveal if user exists
  return true;
};
```

---

### 13. [ ] Add Token Refresh Mechanism (Frontend)
**File:** `OpticsGlassses-frontend/src/context/AuthContext.jsx`
**Fix:**
```javascript
useEffect(() => {
  checkUser();
  
  // Periodic token check (every 5 minutes)
  const interval = setInterval(() => {
    checkUser();
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

---

### 14. [ ] Validate Phone Number Format
**File:** `services/userServices.js` or `models/User.js`
**Fix:**
```javascript
// In User model
phone: {
  type: String,
  required: [true, "Phone number is required"],
  unique: true,
  trim: true,
  validate: {
    validator: function(v) {
      return /^\+?[1-9]\d{9,14}$/.test(v);
    },
    message: 'Invalid phone number format'
  }
}
```

---

## 📦 DEPENDENCIES TO ADD

```bash
npm install express-rate-limit helmet ioredis csurf
```

- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `ioredis` - Token blacklisting (if using Redis)
- `csurf` - CSRF protection

---

## 🔒 ADDITIONAL SECURITY HEADERS

**File:** `server.js`
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## ✅ COMPLETION CHECKLIST

| # | Priority | Task | Status |
|---|----------|------|--------|
| 1 | 🚨 Critical | Strengthen JWT SECRET_KEY | [ ] |
| 2 | 🚨 Critical | Hash OTP before storing | [ ] |
| 3 | 🚨 Critical | Add rate limiting | [ ] |
| 4 | 🚨 Critical | Remove sensitive console logs | [ ] |
| 5 | ⚠️ Major | Add password complexity validation | [ ] |
| 6 | ⚠️ Major | Implement token blacklisting | [ ] |
| 7 | ⚠️ Major | Reduce JWT payload | [ ] |
| 8 | ⚠️ Major | Add CSRF protection | [ ] |
| 9 | ⚠️ Major | Reduce cookie max age | [ ] |
| 10 | 📋 Moderate | Use generic error messages | [ ] |
| 11 | 📋 Moderate | Implement account lockout | [ ] |
| 12 | 📋 Moderate | Fix timing attack in forgot password | [ ] |
| 13 | 📋 Moderate | Add token refresh mechanism | [ ] |
| 14 | 📋 Moderate | Validate phone number format | [ ] |

---

**Note:** Complete all CRITICAL items before deploying to production.
