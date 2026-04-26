import type { Dispatch, SetStateAction } from "react";

export type AppUserType = "client" | "expert";

export type AppUser = {
  type: AppUserType;
  name: string;
};

export type SetAppUser = Dispatch<SetStateAction<AppUser | null>>;

export type RootOutletContext = {
  user: AppUser | null;
  setUser: SetAppUser;
};
