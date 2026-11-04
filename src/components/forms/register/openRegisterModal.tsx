import { modals } from "@mantine/modals";
import { RegisterModal, type RegisterFormData } from "./RegisterModal";

type OpenRegisterModalOptions = {
  title?: string;
  onSubmit: (data: RegisterFormData) => Promise<unknown>;
};

export function openRegisterModal({
  title = "Register",
  onSubmit,
}: OpenRegisterModalOptions) {
  const modalId = modals.open({
    title,
    centered: true,
    closeOnClickOutside: false,
    children: (
      <RegisterModal onSubmit={onSubmit} onClose={() => modals.close(modalId)} />
    ),
  });

  return modalId;
}
