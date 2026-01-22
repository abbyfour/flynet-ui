import { useState } from "react";
import {
  useLazyMeQuery,
  useLoginMutation,
} from "../../../../data/services/usersAPI";
import { useAppDispatch, useAppSelector } from "../../../../data/store";
import { clearUser, saveUser } from "../../../../data/userSlice";
import { addTokenToUser } from "../../../../util/userUtil";
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
        <p>Welcome back, {currentUser.firstName}!</p>
        <button
          className="logout"
          type="button"
          onClick={() => dispatch(clearUser())}
        >
          stop having me be logged in
        </button>
      </div>
    </SidepanelContainer>
  );
}

function LoginForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [me] = useLazyMeQuery();
  const [loginError, setLoginError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokenResponse = await login({
        username: formData.email,
        password: formData.password,
      }).unwrap();

      const userProperties = await me({
        token: tokenResponse.access_token,
      }).unwrap();

      const userWithToken = addTokenToUser(userProperties, tokenResponse);

      dispatch(saveUser(userWithToken));
    } catch (err) {
      console.error("Failed to login:", err);
      setLoginError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="LoginForm">
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          title="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
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
