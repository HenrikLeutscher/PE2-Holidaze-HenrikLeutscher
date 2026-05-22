import { Link, useNavigate } from "react-router";
import { UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { InputField } from "../components/ui/InputField";
import { Button } from "../components/ui/Button";
import { PopupMessage } from "../components/ui/PopupMessage";
import { useAuth } from "../context/useAuth";
import { invalidDisplayName } from "../helpers/sanitizeInput";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isVenueManager: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    document.title = "Register | Holidaze";
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsDisabled(true);

    if (!formData.displayName.trim()) {
      setError("Display Name is required");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (invalidDisplayName(formData.displayName)) {
      setError(
        "Display Name can only contain letters, numbers, spaces, and underscores",
      );
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (!formData.email.endsWith("@stud.noroff.no")) {
      setError("Email must end with @stud.noroff.no");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.displayName,
          email: formData.email,
          password: formData.password,
          venueManager: formData.isVenueManager, // optional
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.errors?.[0]?.message ||
            errorData?.message ||
            `Registration failed: ${response.status}`,
        );
      }

      await response.json();

      await login({ email: formData.email, password: formData.password });
      setShowPopup(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registration Failed");
      }
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-100 my-auto container justify-center items-center flex flex-col gap-5 min-h-screen">
      <div className="bg-primary p-4 rounded-full">
        <UserRoundPlus className="w-10 h-auto text-white" />
      </div>
      <h1 className="text-center text-header1">Create an account</h1>
      <div className="flex flex-col gap-4 shadow-xl p-5 rounded-lg w-full">
        <form className="flex flex-col gap-2" onSubmit={handleRegister}>
          <div className="flex flex-col">
            <InputField
              label="Display Name"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              placeholder="Enter your display name"
              required
            />
          </div>
          <div className="flex flex-col">
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="example@stud.noroff.no"
              required
            />
          </div>
          <div className="flex flex-col">
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password (Min 8 characters)"
              required
            />
          </div>
          <div className="flex flex-col">
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="flex flex-row items-center justify-start gap-10">
            <label className="form-label" htmlFor="isVenueManager">
              Are you a venue manager?
            </label>
            <input
              type="checkbox"
              id="isVenueManager"
              name="isVenueManager"
              checked={formData.isVenueManager}
              onChange={(e) =>
                setFormData({ ...formData, isVenueManager: e.target.checked })
              }
            />
          </div>
          <Button
            text="Register"
            type="submit"
            disabled={loading || isDisabled}
            loading={loading}
          />
          {error && (
            <p className="bg-red-500 text-white text-center py-2 my-2 rounded-2xl">
              {error}
            </p>
          )}

          <p className="text-center text-bodytext">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline text-bodytext"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
      {showPopup && (
        <PopupMessage
          message="Successfully registered, redirecting..."
          type="success"
          onComplete={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
