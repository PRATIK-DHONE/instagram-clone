
"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type ProfileState,
} from "@/app/actions/profile-actions";

type Props = {
  name: string;
  bio: string;
};

const initialState: ProfileState = {
  success: false,
  message: "",
};

export default function EditProfileForm({
  name,
  bio,
}: Props) {
  const [state, action, pending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      <label className="flex flex-col gap-1">
        Name
        <input
          name="name"
          defaultValue={name}
          maxLength={60}
          className="rounded border p-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        Bio
        <textarea
          name="bio"
          defaultValue={bio}
          maxLength={150}
          rows={4}
          className="rounded border p-2"
        />
      </label>

      {state.message && (
        <p role="status">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 p-3 text-white"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
