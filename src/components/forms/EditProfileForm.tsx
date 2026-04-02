import { SubmitButton } from "@components/common/buttons/SubmitButton";
import { useAppSelector } from "@data/store";
import { IconAt } from "@tabler/icons-react";
import { useState } from "react";
import "./EditProfileForm.scss";
import { Input } from "./Input";

type EditProfileFormProps = {
  clearEditing: () => void;
};

export function EditProfileForm({ clearEditing }: EditProfileFormProps) {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [editingUser, setEditingUser] = useState(currentUser!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    clearEditing();
  };

  return (
    <div className="EditProfileForm">
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <Input
            type="text"
            label="Nickname"
            id="nickname"
            value={editingUser.nickname}
            onChange={(v) => setEditingUser({ ...editingUser, nickname: v })}
            fingerprinted
          />

          <Input
            type="text"
            label="Username"
            id="username"
            icon={<IconAt size={16} />}
            value={editingUser.username}
            disabled
          />

          <Input
            type="text"
            label="Email"
            id="email"
            value={editingUser.email}
            onChange={(v) => setEditingUser({ ...editingUser, email: v })}
            fingerprinted
          />
        </div>

        <SubmitButton className="submit-button">Save profile</SubmitButton>
      </form>
    </div>
  );
}
