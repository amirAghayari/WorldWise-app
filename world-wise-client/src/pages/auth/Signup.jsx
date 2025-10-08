import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";
import Spinner from "../../components/Spinner";

const schema = z
  .object({
    firstname: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces"),
    lastname: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]*$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .email("Invalid email address")
      .min(5, "Email is too short")
      .max(100, "Email is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    passwordConfirm: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await axios.post("/api/v1/users/signup", {
        ...data,
        role: "user",
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        setSignupSuccess(true);
        reset();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred during signup. Please try again.";
      setServerError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.title}>Create Your Account</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="First Name"
            className={styles.input}
            {...register("firstname")}
            disabled={isLoading}
          />
          {errors.firstname && (
            <span className={styles.error}>{errors.firstname.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Last Name"
            className={styles.input}
            {...register("lastname")}
            disabled={isLoading}
          />
          {errors.lastname && (
            <span className={styles.error}>{errors.lastname.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            {...register("username")}
            disabled={isLoading}
          />
          {errors.username && (
            <span className={styles.error}>{errors.username.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            {...register("passwordConfirm")}
            disabled={isLoading}
          />
          {errors.passwordConfirm && (
            <span className={styles.error}>
              {errors.passwordConfirm.message}
            </span>
          )}
        </div>

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        {signupSuccess && (
          <div className={styles.successMessage}>
            Signup successful! Redirecting to homepage...
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        {isLoading && (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        )}
      </form>
    </div>
  );
}
