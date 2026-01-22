import { useAppSelector } from "../../../../data/store";

export function Profile() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <div>Please sign in :3</div>;
  }

  return (
    <div>
      <h1>{currentUser.firstName}'s Profile</h1>

      <p>
        Name: {currentUser.firstName} {currentUser.lastName}
      </p>
      <p>Email: {currentUser.email}</p>
      {currentUser.lastLogin ? (
        <p>
          Last login: {new Date(currentUser.lastLogin).toLocaleDateString()}
        </p>
      ) : null}
      <p>Times logged in: {currentUser.loginCount}</p>
      <p>Role: {currentUser.tokenDetails.role}</p>
    </div>
  );
}
