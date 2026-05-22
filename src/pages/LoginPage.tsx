import { Link, useNavigate } from "react-router";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { InputField } from "../components/ui/InputField";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import { PopupMessage } from "../components/ui/PopupMessage";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    document.title = "Login | Holidaze";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsDisabled(true);
    try {
      await login(formData);
      setPopup({ message: "Successfully logged in", type: "success" });
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      setPopup({ message: err.message || "Unknown error", type: "error" });
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-100 my-auto container flex flex-col gap-5">
      <div className="bg-primary p-4 rounded-full w-17 h-17 mx-auto">
        <LogIn className="w-10 h-auto text-white" />
      </div>
      <h1 className="text-center text-header1">Login</h1>
      <div className="flex flex-col gap-4 shadow-xl p-5 rounded-lg w-full">
        <form className="flex flex-col gap-2">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter your email"
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter your password"
            required
          />
          <Button
            text="Login"
            type="button"
            onClick={handleLogin}
            disabled={isDisabled}
            loading={loading}
          />
          <p className="text-center text-bodytext">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
      {popup && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onComplete={() => setPopup(null)}
        />
      )}
    </div>
  );
}
