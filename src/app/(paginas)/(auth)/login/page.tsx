"use client";

import { useState } from "react"; 
import { Eye, EyeOff } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "@/schemas/LoginSchema";
import { useUserContext } from "@/providers/UserContext";
import { ChevronLeft, CircleUserRound, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
    const router = useRouter();

    const { loginUser, isLoading } = useUserContext();

    type userLoginData = z.infer<typeof userLoginSchema>;

    const [mostrarSenha, setMostrarSenha] = useState(false); 

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
    } = useForm<userLoginData>({
        resolver: zodResolver(userLoginSchema),
    });

    const onSubmit = async (data: userLoginData) => {
        clearErrors("root");
        const success = await loginUser(data);
        if (!success) {
            toast.error("Falha no login. Verifique suas credenciais.");
            setError("root", {
                type: "manual",
                message: "Falha no login. Verifique suas credenciais.",
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 p-6">
            <div className="flex flex-row items-center gap-5">
                <Button
                    type="button"
                    size={"default"}
                    variant={"ghost"}
                    className="cursor-pointer hover:bg-primary/40"
                    onClick={() => router.back()}>
                    <ChevronLeft />
                    <p className="text-2xl font-semibold">Voltar</p>
                </Button>
            </div>
            <div className="flex h-full items-center justify-center ">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 text-lg font-medium 2xl:text-xl">
                    <label htmlFor="email" className="flex flex-col gap-2">
                        Email
                        <Input
                            {...register("email")}
                            type="text"
                            className="bg-background rounded-md border-1 border-gray-300 px-2 py-2"
                        />
                        <span className="text-sm text-red-500">
                            {errors && errors.email?.message}
                        </span>
                    </label>
                    <label htmlFor="password" className="flex flex-col gap-2">
                        Senha

                        <div className="relative">
                            <Input
                            id="password"
                            {...register("password")}
                            type={mostrarSenha ? "text" : "password"}
                            className="bg-background rounded-md border-1 border-gray-300 px-2 py-2"
                            />

                            <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                            {mostrarSenha ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                            </button>
                        </div>

                        <span className="text-sm text-red-500">
                            {errors && errors.password?.message}
                        </span>
                    </label>
                    {errors && (
                        <p className="text-sm text-red-500">
                            {errors.root?.message}
                        </p>
                    )}
                    <Button type="submit" disabled={isSubmitting || isLoading}>
                        {isSubmitting || isLoading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <CircleUserRound />
                        )}
                        Fazer Login
                    </Button>
                    <div className="flex items-center justify-center"><span className="text-xs" >© 2026 ICTITE</span></div>
                </form>
            </div>
        </div>
    );
}
