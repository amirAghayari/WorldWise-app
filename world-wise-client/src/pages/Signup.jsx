import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";

const schema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirm: z
    .string()
    .min(6, "Password confirmation must be at least 6 characters")
    .refine((val, ctx) => val === ctx.parent.password, "Passwords must match"),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError(""); // Clear previous errors
      await axios.post("/api/v1/users/signup", {
        ...data,
        role: "user",
      });
      alert("Signup successful!");
    } catch (err) {
      setServerError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign Up</h2>
      <input type="text" placeholder="First Name" {...register("firstname")} />
      {errors.firstname && <p>{errors.firstname.message}</p>}

      <input type="text" placeholder="Last Name" {...register("lastname")} />
      {errors.lastname && <p>{errors.lastname.message}</p>}

      <input type="text" placeholder="Username" {...register("username")} />
      {errors.username && <p>{errors.username.message}</p>}

      <input type="email" placeholder="Email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" placeholder="Password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="password"
        placeholder="Confirm Password"
        {...register("passwordConfirm")}
      />
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
