import { Html, Button } from "@react-email/components";

export function ResetPassword() {
  return (
    <Html>
      <Button
        href="http://localhost:3000/reset-password"
        style={{ background: "green", color: "#fff", padding: "12px 25px" }}
      >
        Reset Password
      </Button>
    </Html>
  )
}