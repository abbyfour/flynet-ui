import { useAppSelector } from "../../../../data/store";

export function Profile() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <div>Please sign in!</div>;
  }

  return (
    <div>
      <h1>{currentUser.nickname}'s Profile</h1>
      <h2>{currentUser.username}</h2>

      <p>Email: {currentUser.email || "(unset)"}</p>
      <p>Role: {currentUser.role.name}</p>
    </div>
  );
}
