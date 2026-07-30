import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth";
import { verifyUserCredentials } from "@/lib/auth-store";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const user = verifyUserCredentials(validatedData.email, validatedData.password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          onboarding_complete: user.onboarding_complete,
          created_at: user.created_at,
        },
      },
      message: "Logged in successfully.",
    });

    response.cookies.set("actionlens_demo_user", "true", { path: "/", maxAge: 86400 });
    response.cookies.set("actionlens_user_id", user.id, { path: "/", maxAge: 86400 });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
}
