export function friendlyError(error) {
  const msg = error?.message || "";

  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (msg.includes("User already registered")) {
    return "An account with this email already exists.";
  }

  if (msg.includes("Email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (msg.includes("duplicate key")) {
    return "Record already exists.";
  }

  return msg || "Something went wrong.";
}



