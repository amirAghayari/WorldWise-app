import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Spinner from "../../components/Spinner";

const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await axios.post("/api/v1/users/login", data);

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        // You might want to store user data in context or state management
        if (res.data.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
        }
        setLoginSuccess(true);
        reset();

        // Delay navigation to show success message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setServerError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Welcome Back</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        {loginSuccess && (
          <div className={styles.successMessage}>
            Login successful! Redirecting...
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        {isLoading && (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        )}
      </form>

      <div className={styles.footer}>
        Don't have an account?
        <Link to="/signup" className={styles.link}>
          Sign up here
        </Link>
      </div>
    </div>
  );
}
