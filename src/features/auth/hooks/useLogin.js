import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "../services/authService";
import { ROLE_HOME } from "@/utils/constants";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await authService.login(credentials);
      login(data);
      navigate(ROLE_HOME[data.user.role] || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}