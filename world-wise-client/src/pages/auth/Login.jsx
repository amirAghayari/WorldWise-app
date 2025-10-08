import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Spinner from "../../components/Spinner";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await axios.post("/api/v1/users/login", data);

      const token = res?.data?.token;
      const userData = res?.data?.data?.user;

      if (token && userData) {
        login(userData, token); // ✅ به‌روزرسانی Context
        setLoginSuccess(true);
        reset();

        setTimeout(() => navigate("/app"), 1200);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setServerError(errorMessage);
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
            {...register("email")}
            disabled={isLoading}
            className={styles.input}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            disabled={isLoading}
            className={styles.input}
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
        Don’t have an account?
        <Link to="/signup" className={styles.link}>
          Sign up here
        </Link>
      </div>
    </div>
  );
}
