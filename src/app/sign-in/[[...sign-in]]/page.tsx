import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100vh-120px)] place-items-center py-10">
      <SignIn />
    </main>
  );
}
