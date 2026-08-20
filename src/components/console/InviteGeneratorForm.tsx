"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { generateSchoolInvite } from "@/core/service/AuthService";
import { GenerateInviteResponse } from "@/core/domain/Invite";
import { Check, Copy, Link2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { getAssetPrefix } from "@/core/utils/api";

interface InviteGeneratorFormProps {
    schoolId: string;
    schoolName?: string;
}

export function InviteGeneratorForm({
    schoolId,
    schoolName,
}: InviteGeneratorFormProps) {
    const [invite, setInvite] = useState<GenerateInviteResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const inviteUrl = invite
        ? `${window.location.origin}${getAssetPrefix()}/convite/${invite.invite_token}`
        : "";

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const data = await generateSchoolInvite(schoolId);
            setInvite(data);
            setCopied(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao gerar o convite."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            toast.success("Link de convite copiado!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Não foi possível copiar o link.");
        }
    };

    return (
        <Dialog onOpenChange={(open) => !open && setInvite(null)}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="gap-2">
                    <Link2 size={16} />
                    Gerar convite
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {schoolName
                            ? `Convite — ${schoolName}`
                            : "Gerar convite de acesso"}
                    </DialogTitle>
                    <DialogDescription>
                        Gere um link único para que um pesquisador se autocadastre e
                        gerencie esta escola. O convite expira em 7 dias.
                    </DialogDescription>
                </DialogHeader>

                {!invite ? (
                    <div className="flex flex-col gap-4 py-2">
                        <p className="text-sm text-gray-600">
                            Ao gerar, você receberá um link que deve ser enviado ao
                            pesquisador da escola.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">
                                Link de convite
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={inviteUrl}
                                    className="bg-background border-1 flex-1 truncate rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    title="Copiar link">
                                    {copied ? (
                                        <Check size={16} className="text-green-600" />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Expira em {new Date(invite.expires_at).toLocaleDateString(
                                "pt-BR"
                            )}
                        </p>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:justify-between">
                    {!invite && (
                        <Button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isLoading}>
                            {isLoading ? (
                                <LoaderCircle className="mr-2 animate-spin" />
                            ) : (
                                <Link2 className="mr-2" size={16} />
                            )}
                            Gerar link
                        </Button>
                    )}
                    {invite && (
                        <Button
                            type="button"
                            onClick={handleGenerate}
                            variant="ghost"
                            disabled={isLoading}>
                            {isLoading ? (
                                <LoaderCircle className="mr-2 animate-spin" />
                            ) : (
                                "Gerar novo"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}