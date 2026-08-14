import { InviteRegistrationForm } from "@/components/auth/InviteRegistrationForm";

interface InvitePageProps {
    params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
    const { token } = await params;
    return <InviteRegistrationForm token={token} />;
}