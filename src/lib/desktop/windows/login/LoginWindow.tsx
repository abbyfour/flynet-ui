import { useState } from "react";
import { useLoginMutation } from "../../../../data/services/usersAPI";
import { useAppDispatch, useAppSelector } from "../../../../data/store";
import { clearUser, saveUser } from "../../../../data/userSlice";
import { SidepanelContainer } from "../../SidepanelContainer";
import "./LoginWindow.scss";

export function LoginWindow() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  return !currentUser ? (
    <SidepanelContainer align="right" className="LoginWindow">
      <LoginForm />
    </SidepanelContainer>
  ) : (
    <SidepanelContainer align="right" className="LoginWindow">
      <div className="LoggedInMessage">
        <p>Welcome back, {currentUser.nickname}!</p>
        <button
          className="logout"
          type="button"
          onClick={() => dispatch(clearUser())}
        >
          logout
        </button>
      </div>
    </SidepanelContainer>
  );
}

function LoginForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [loginError, setLoginError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      dispatch(saveUser(user));
    } catch (err) {
      console.error("Failed to login:", err);
      setLoginError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="LoginForm">
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          title="username"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder="Enter your username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          title="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="hunter2"
          required
        />

        {loginError && <p className="login-error">Login data fill issue</p>}

        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
