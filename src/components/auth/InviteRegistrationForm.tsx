"use client";

import {useState} from 'react';
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/providers/UserContext";
import { RegisterInvitedRequestSchema } from "@/core/domain/Invite";
import { ChevronLeft, LoaderCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const InviteRegistrationFormSchema = RegisterInvitedRequestSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
});

type InviteRegistrationData = z.infer<typeof InviteRegistrationFormSchema>;

interface InviteRegistrationFormProps {
    token: string;
}

function getInviteErrorMessage(message: string): string {

    const normalizedMessage = message.toLowerCase();
    if (normalizedMessage.includes("e-mail já está cadastrado")) {
        return "Este e-mail já está cadastrado no sistema.";
    }
    if (normalizedMessage.includes("convite já foi utilizado")) {
        return "Este convite já foi utilizado.";
    }
    if (normalizedMessage.includes("convite expirou")) {
        return "Este convite expirou.";
    }
    if (normalizedMessage.includes("convite é inválido")) {
        return "Este convite é inválido.";
    }
    return "Não foi possível ativar sua conta. Tente novamente.";
}

export function InviteRegistrationForm({ token }: InviteRegistrationFormProps) {
    const router = useRouter();
    const { registerInvitedUser, isLoading } = useUserContext();

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
    } = useForm<InviteRegistrationData>({
        resolver: zodResolver(InviteRegistrationFormSchema),
        defaultValues: { invite_token: token },
    });

    const onSubmit = async (data: InviteRegistrationData) => {
        clearErrors("root");
        const { confirmPassword: _confirmPassword, ...payload } = data;
        const errorMessage = await registerInvitedUser(payload);
        if (errorMessage) {
            setError("root", {
                type: "manual",
                message: getInviteErrorMessage(errorMessage),
            });
        }
    };

    return (
        <div className="bg-gray-100 flex h-full flex-col p-6">
            <div className="flex flex-row items-center gap-5">
                <Button
                    type="button"
                    size={"default"}
                    variant={"ghost"}
                    className="cursor-pointer hover:bg-primary/40"
                    onClick={() => router.push("/login")}>
                    <ChevronLeft />
                    <p className="text-2xl font-semibold">Voltar</p>
                </Button>
            </div>
            <div className="flex h-full items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full max-w-xl flex-col gap-4 text-lg font-medium 2xl:text-xl">
                    <input type="hidden" {...register("invite_token")} />

                    <div className="flex flex-col gap-1 text-center">
                        <h1 className="text-2xl font-semibold">
                            Ative sua conta de pesquisador
                        </h1>
                        <p className="text-sm text-gray-500">
                            Você foi convidado para gerenciar sua escola na rede ICTITE.
                            Crie uma senha para concluir o cadastro.
                        </p>
                    </div>

                    <label htmlFor="email" className="flex flex-col gap-2">
                        Email
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="seuemail@escola.com.br"
                            className="bg-background border-1 rounded-md border-gray-300 px-2 py-2"
                        />
                        <span className="text-sm text-red-500">
                            {errors.email?.message}
                        </span>
                    </label>

                    <label htmlFor="password" className="flex flex-col gap-2">
                        Senha

                        <div className="relative w-full">
                            <Input
                                id="password"
                                {...register("password")}
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full bg-background border rounded-md border-gray-300 px-2 py-2 pr-10"
                            />

                            <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>


                        </div>

                        <span className="text-sm text-red-500">
                            {errors.password?.message}
                        </span>
                    </label>

                    <label htmlFor="confirmPassword" className="flex flex-col gap-2">
                        Confirmar senha

                        <div className="relative w-full">
                            <Input
                                id="confirmPassword"
                                {...register("confirmPassword")}
                                type={mostrarConfirmarSenha ? "text" : "password"}
                                placeholder="Repita a senha"
                                className="w-full bg-background border rounded-md border-gray-300 px-2 py-2 pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                aria-label={mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            
                        </div>

                        <span className="text-sm text-red-500">
                            {errors.confirmPassword?.message}
                        </span>
                    </label>

                    {errors.root && (
                        <p className="text-sm text-red-500">{errors.root.message}</p>
                    )}

                    <Button type="submit" disabled={isSubmitting || isLoading}>
                        {isSubmitting || isLoading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <UserPlus />
                        )}
                        Ativar conta
                    </Button>
                    <div className="flex items-center justify-center">
                        <span className="text-xs">© 2026 ICTITE</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
