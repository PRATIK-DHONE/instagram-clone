"use client";

import { useActionState, useEffect, useState } from "react";
import { createPost, type PostState } from "@/app/actions/post-actions";

const initialState: PostState = {
  success: false,
  message: "",
};

export default function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(
    createPost,
    initialState
  );

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">Create new post</h1>

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="image" className="mb-2 block font-medium">
            Select image
          </label>

          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            disabled={isPending}
            onChange={(event) =>
              setImage(event.target.files?.[0] ?? null)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {preview && (
          <div>
            <p className="mb-2 font-medium">Image preview</p>
            <img
              src={preview}
              alt="Selected post preview"
              className="max-h-96 w-full rounded-lg object-contain"
            />
          </div>
        )}

        <div>
          <label htmlFor="caption" className="mb-2 block font-medium">
            Caption
          </label>

          <textarea
            id="caption"
            name="caption"
            rows={4}
            maxLength={2200}
            placeholder="Write a caption..."
            disabled={isPending}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {state.message && (
          <p
            role="status"
            className={
              state.success ? "text-green-600" : "text-red-600"
            }
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Publishing..." : "Share post"}
        </button>
      </form>
    </div>
  );
}