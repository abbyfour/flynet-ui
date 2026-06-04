import { SubmitButton } from "@components/common/buttons/SubmitButton";
import { Input } from "@components/forms/Input";
import { useLazyGetFlightsQuery } from "@data/services/flights/flightsAPI";
import { useLoginMutation } from "@data/services/usersAPI";
import { useAppDispatch, useAppSelector } from "@data/store";
import { clearThinking, setPermanentThinking } from "@data/uiSlice";
import { saveUser } from "@data/userSlice";
import { Alert } from "@mantine/core";
import { useState } from "react";
import { SidepanelContainer } from "../SidepanelContainer";

import "./LoginWindow.scss";

export function LoginWindow() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  return !currentUser ? (
    <SidepanelContainer align="right" className="LoginWindow">
      <LoginForm />
    </SidepanelContainer>
  ) : (
    <></>
  );
}

function LoginForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [getFlights] = useLazyGetFlightsQuery();

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
      dispatch(setPermanentThinking("you look familiar! loading your flights"));
      getFlights().then(() => {
        dispatch(clearThinking());
      });
    } catch (err) {
      console.error("Failed to login:", err);
      setLoginError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="LoginForm">
      <form onSubmit={handleLogin}>
        <Input
          required
          type="text"
          id="username"
          label="Username"
          placeholder="Enter your username"
          disabled={isLoggingIn}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, username: value || "" }));
            setLoginError(null);
          }}
        />

        <Input
          required
          type="password"
          id="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isLoggingIn}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, password: value || "" }));
            setLoginError(null);
          }}
        />

        {loginError && (
          <Alert className="login-error" color="red">
            Access denied.
          </Alert>
        )}

        <SubmitButton
          loading={isLoggingIn}
          disabled={!formData.username || !formData.password}
        >
          Login
        </SubmitButton>
      </form>
    </div>
  );
}
