const zod = require("zod");

//Signup Type Check
const signupSchema = zod.object({
  username: zod.string().trim().refine(username => username.trim() !== '', {
      message: "Username cannot be empty.",
    }),
  email: zod.string().email({ message: "Enter Email Correctly." }).trim().toLowerCase(),
  password: zod
    .string()
    .min(8, { message: "Minimum Password Length : 8" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-])\S{8,}$/,
      {
        message:
          "Enter at least 1 Capital Letter, 1 Small letter, 1 Special Character, and 1 Number.",
      }
    )
    .trim(),
});

//Signin Type Check
const signinSchema = zod.object({
  usernameOrEmail: zod
    .string()
    .min(1, { message: "Enter Your Email Or Username" })
    .trim(),
  password: zod.string().min(1, { message: "Enter Your Password" }).trim(),
});

module.exports = { signupSchema, signinSchema };
