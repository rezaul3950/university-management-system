import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { submit, loading, error } = useLogin();
  return <LoginForm onSubmit={submit} loading={loading} error={error} />;
}