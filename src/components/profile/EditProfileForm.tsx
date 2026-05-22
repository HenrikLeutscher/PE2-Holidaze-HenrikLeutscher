import { useEffect, useState } from "react";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { editProfile } from "../../api/editProfile";
import { useAuth } from "../../context/useAuth";

export function EditProfileForm({ profile }: { profile: any }) {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    bio: "",
    avatar: { url: "", alt: "" },
    banner: { url: "", alt: "" },
  });

  useEffect(() => {
    setFormData({
      bio: profile?.bio || "",
      avatar: {
        url: profile?.avatar?.url || "",
        alt: profile?.avatar?.alt || "",
      },
      banner: {
        url: profile?.banner?.url || "",
        alt: profile?.banner?.alt || "",
      },
    });
  }, [profile, user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsDisabled(true);

    try {
      if (formData.bio.length > 160) {
        setError("Bio cannot exceed 160 characters");
        setLoading(false);
        setIsDisabled(false);
        return;
      }

      const payload: any = {};
      if (formData.bio) payload.bio = formData.bio;
      if (formData.avatar.url) payload.avatar = formData.avatar;
      if (formData.banner.url) payload.banner = formData.banner;

      if (Object.keys(payload).length === 0) {
        setError("Please provide at least one field to update");
        setLoading(false);
        setIsDisabled(false);
        return;
      }

      await editProfile(user!.name, payload, token!);

      window.location.reload();
    } catch (error) {
      setError("Failed to edit profile");
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full">
      <InputField
        name="bio"
        label="Bio"
        placeholder="Enter your bio here"
        type="text"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />
      <InputField
        name="Avatar URL"
        label="Avatar URL"
        placeholder="Avatar URL"
        type="text"
        value={formData.avatar.url}
        onChange={(e) =>
          setFormData({
            ...formData,
            avatar: { ...formData.avatar, url: e.target.value },
          })
        }
      />
      <InputField
        name="Avatar ALT Text"
        label="Avatar ALT Text"
        placeholder="Avatar ALT Text"
        type="text"
        value={formData.avatar.alt}
        onChange={(e) =>
          setFormData({
            ...formData,
            avatar: { ...formData.avatar, alt: e.target.value },
          })
        }
      />
      <InputField
        name="Banner URL"
        label="Banner URL"
        placeholder="Banner URL"
        type="text"
        value={formData.banner.url}
        onChange={(e) =>
          setFormData({
            ...formData,
            banner: { ...formData.banner, url: e.target.value },
          })
        }
      />
      <InputField
        name="Banner ALT Text"
        label="Banner ALT Text"
        placeholder="Banner ALT Text"
        type="text"
        value={formData.banner.alt}
        onChange={(e) =>
          setFormData({
            ...formData,
            banner: { ...formData.banner, alt: e.target.value },
          })
        }
      />
      <Button
        text="Save Changes"
        type="submit"
        onClick={handleEditProfileSubmit}
        disabled={loading || isDisabled}
        loading={loading}
      />
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </form>
  );
}
