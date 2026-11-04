import { Button } from "@components/common/buttons/Button";
import { SubmitButton } from "@components/common/buttons/SubmitButton";
import { Input } from "@components/forms/Input";
import { Alert } from "@mantine/core";
import { useState } from "react";
import "./RegisterModal.scss";

const SUCCESS_TITLE =
  "Take your seat and prepare for takeoff. You can now log in.";

export type RegisterFormData = {
  username: string;
  password: string;
  email: string;
};

type RegisterModalProps = {
  /** Should reject if registration fails */
  onSubmit: (data: RegisterFormData) => Promise<unknown>;
  onClose: () => void;
};

export function RegisterModal({ onSubmit, onClose }: RegisterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredUsername, setRegisteredUsername] = useState<string | null>(
    null,
  );
  const onCancel = onClose;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const passwordsMismatch =
    confirmPassword !== "" && password !== confirmPassword;
  const canSubmit =
    !!username &&
    !!password &&
    !!email &&
    password === confirmPassword &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ username, password, email });
      setRegisteredUsername(username);
    } catch {
      setError("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  if (registeredUsername !== null) {
    return (
      <div className="RegisterModal RegisterModal--success">
        <div className="RegisterModal__success-content">
          <img
            className="RegisterModal__seat"
            src="/images/flynetseat.png"
            alt={SUCCESS_TITLE}
            title={SUCCESS_TITLE}
          />
          <p className="RegisterModal__success-title">{SUCCESS_TITLE}</p>
        </div>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form className="RegisterModal" onSubmit={handleSubmit}>
      <Input
        required
        type="text"
        id="register-username"
        label="Username"
        placeholder="Choose a username"
        disabled={loading}
        onChange={(value) => setUsername(value || "")}
      />

      <Input
        required
        type="text"
        id="register-email"
        label="Email"
        placeholder="Enter your email"
        disabled={loading}
        onChange={(value) => setEmail(value || "")}
      />

      <Input
        required
        type="password"
        id="register-password"
        label="Password"
        placeholder="Choose a password"
        disabled={loading}
        onChange={(value) => setPassword(value || "")}
      />

      <Input
        required
        type="password"
        id="register-confirm-password"
        label="Confirm password"
        placeholder="Re-enter your password"
        disabled={loading}
        onChange={(value) => setConfirmPassword(value || "")}
      />

      {passwordsMismatch && <Alert color="red">Passwords do not match.</Alert>}

      {error && <Alert color="red">{error}</Alert>}

      <SubmitButton loading={loading} disabled={!canSubmit}>
        Register
      </SubmitButton>

      <Button type="button" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
    </form>
  );
}
