import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UpdateProfile.module.css";
import Spinner from "./../components/Spinner";

const schema = z.object({
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
  avatar: z.any().optional(),
});

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    async function fetchUser() {
      try {
        const res = await axios.get("/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User response:", res.data);
        setUserData(res.data.data.data);
        setValue("firstname", res.data.data.data.firstname);
        setValue("lastname", res.data.data.data.lastname);
        setValue("username", res.data.data.data.username);
        setValue("email", res.data.data.data.email);
        setPreview(res.data.data.data.avatar);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setServerError("Failed to load user data.");
      }
    }

    fetchUser();
  }, [navigate, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("avatar", file);
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form data to submit:", data);
    setIsLoading(true);
    setServerError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("username", data.username);
      formData.append("email", data.email);
      if (data.avatar instanceof File) formData.append("avatar", data.avatar);

      const res = await axios.patch("/api/v1/users/updateMe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status === "success") {
        setUpdateSuccess(true);
        setUserData(res.data.data.user);
        setPreview(res.data.data.user.avatar);
        setTimeout(() => navigate("/app/cities"), 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while updating profile.";
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.editContainer}>
      <h2 className={styles.title}>Edit Profile</h2>

      {!userData && isLoading && <Spinner />}

      {userData && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.avatarSection}>
            <label htmlFor="avatarUpload" className={styles.avatarLabel}>
              <img
                src={
                  preview ||
                  "/green-user-account-profile-flat-icon-apps-websites_1254296-1186.jpg"
                }
                alt="User avatar"
                className={styles.avatarPreview}
              />
              <span className={styles.changeText}>Change photo</span>
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleImageChange}
              disabled={isLoading}
            />
          </div>

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

          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          {updateSuccess && (
            <div className={styles.successMessage}>
              Profile updated successfully! Redirecting...
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || isSubmitting}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          {isLoading && (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          )}
        </form>
      )}
    </div>
  );
}
