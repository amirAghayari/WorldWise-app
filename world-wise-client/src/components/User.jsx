import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { useAuth } from "../contexts/AuthContext";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.firstname} />
      <span>Welcome, {user.firstname}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
