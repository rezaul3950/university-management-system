import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input id="email" name="email" type="email" label="Email" value={form.email} onChange={handleChange} required />
      <Input id="password" name="password" type="password" label="Password" value={form.password} onChange={handleChange} required />
      {error && <p style={{ color: "var(--color-danger)", fontSize: 14 }}>{error}</p>}
      <Button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}