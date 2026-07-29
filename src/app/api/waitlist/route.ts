import { waitlistFormSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";



export async function POST(req: NextRequest) {

    let body: unknown;
    try {
        body = await req.json();

    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const result = waitlistFormSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            {
                error: "Validation failed",
                fieldErrors: result.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const data = result.data;

    const { error } = await supabaseAdmin
        .from("waitlist_signups")
        .insert({
            full_name: data.fullName,
            email: data.contactMethod === "email" ? data.email : null,
            phone: data.contactMethod === "phone" ? data.phone : null,
            referral_source: data.referralSource,
            market: data.market,
        });

    if (error) {
        if (error.code === "23505") {
            return NextResponse.json(
                {
                    error: "You're already waitlisted for this market.",
                },
                { status: 409 }
            );
        }

        console.error("Waitlist signup failed:", error);

        return NextResponse.json(
            { error: "Unable to join the waitlist. Please try again." },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { message: "Successfully joined the waitlist." },
        { status: 201 }
    );
}