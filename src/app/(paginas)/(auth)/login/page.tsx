"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "@/schemas/LoginSchema";
import { useUserContext } from "@/providers/UserContext";
export default function Login() {
    const { loginUser, error } = useUserContext();
    type userLoginData = z.infer<typeof userLoginSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<userLoginData>({
        resolver: zodResolver(userLoginSchema),
    });

    const onSubmit = async (data: userLoginData) => {
        const success = await loginUser(data);
        if (success) {
            console.log("Login successful");
        } else {
            console.log(error);
        }
    };

    return (
        <div className="flex h-full items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 text-lg font-medium 2xl:text-xl">
                <label htmlFor="username" className="flex flex-col gap-2">
                    Nome
                    <Input
                        {...register("username")}
                        type="text"
                        className="bg-background #b5b5b5 rounded-md border-1 border-gray-300 px-2 py-2"
                    />
                    <span className="text-sm text-red-500">
                        {errors && errors.username?.message}
                    </span>
                </label>
                <label htmlFor="password" className="flex flex-col gap-2">
                    Senha
                    <Input
                        {...register("password")}
                        type="password"
                        className="bg-background rounded-md border-1 border-gray-300 px-2 py-2"
                    />
                    <span className="text-sm text-red-500">
                        {errors && errors.password?.message}
                    </span>
                </label>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit">Fazer Login</Button>
            </form>
        </div>
    );
}
