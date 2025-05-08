import LoginForm from "@/components/auth/LoginForm";

export default function StaffLoginPage() {
  return (
    <LoginForm
      role="staff"
      title="Staff Login"
      description="Log in to update status and communicate."
    />
  );
}
