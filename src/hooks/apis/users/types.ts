export type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type UpdateProfileRequest = {
  displayName: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
