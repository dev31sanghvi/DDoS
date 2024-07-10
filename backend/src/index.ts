import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

//storing otp in memory
const otpStore: { [key: string]: string } = {};

//endpoint to generate otp
//this request will go out when user generstes the otp
app.post('/generate-otp', (req, res) => {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit OTP
    // Store the OTP in memory
    otpStore[email] = otp;

    console.log(`OTP for ${email}: ${otp}`); // Log the OTP to the console
    res.status(200).json({ message: "OTP generated and logged" });
  });


  // this request will go out when user resets the password
  app.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (otpStore[email] === otp) {
      console.log(`Password for ${email} has been reset to: ${newPassword}`);
      delete otpStore[email]; // Clear the OTP after use
      res.status(200).json({ message: "Password has been reset successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });