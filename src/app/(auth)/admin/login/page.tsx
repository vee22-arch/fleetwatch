import LoginForm from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <LoginForm 
      role="admin"
      title="Admin Login"
      description="Access the FleetWatch control panel."
    />
  );
}
