import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { GitHubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin";
import { isAdminAuthConfigured } from "@/lib/feature-config";

export default async function AdminLoginPage() {
  if (!isAdminAuthConfigured()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-32">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto w-fit rounded-full bg-destructive/10 p-3">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold">Admin Unavailable</h1>
          <p className="text-muted-foreground">
            Admin access is disabled until database access, `AUTH_SECRET`, and
            GitHub OAuth credentials are configured.
          </p>
        </div>
      </div>
    );
  }

  const session = await auth();

  if (session) {
    const authorized = await isAdmin();
    if (authorized) {
      redirect("/admin/inbox");
    }

    return (
      <div className="py-32 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto w-fit p-3 rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You&apos;re signed in as{" "}
            <span className="text-foreground font-medium">
              {session.user?.email ?? session.user?.name ?? "unknown"}
            </span>
            , but this account is not authorized to access the admin area.
          </p>
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <p className="text-muted-foreground">
          Sign in with GitHub to access the admin dashboard.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin/inbox" });
          }}
        >
          <Button type="submit" variant="brandCta">
            <GitHubIcon className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </form>
      </div>
    </div>
  );
}
