"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
export default function Login(){

    const userLoginSchema = z.object({
        email: z.string({
            required_error: "O email deve ser preenchido"
        })
        .email("Formato inválido de email"),
        password: z.string({
            required_error: "O campo da senha não deve estar vazio"
        }).nonempty("O campo da senha não deve estar vazio")
    })

    type userLoginData = z.infer<typeof userLoginSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
  } = useForm<userLoginData>({
    resolver: zodResolver(userLoginSchema)
  });

  const onSubmit = (data: userLoginData) => {
    console.log(data)
  }

    return(
        <div className="flex items-center bg-gray-100 h-full justify-center">
            <div className="w-3/4 2xl:w-1/2 flex flex-col gap-4 2xl:gap-6">
            <div >
                <h2 className="text-border text-4xl self-baseline font-bold mb-2">Fazer Login</h2>
                <p className="text-xl">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            </div>

            <div className="flex flex-col gap-6 text-xl font-medium">
                <Button variant={"outline"} className=" cursor-pointer">Login com Microsoft</Button>
                <Button variant={"outline"} className=" cursor-pointer">Login com Google</Button>
            </div>

            <div className="flex flex-row items-center gap-4">
                <hr className="bg-gray-800 w-1/2" />
                <p>Ou</p>
                <hr className="bg-gray-800  w-1/2" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 font-medium text-lg 2xl:text-xl">
                <label htmlFor="email" className="flex flex-col gap-2">
                    Email
                    <Input 
                        {...register("email")}
                        type="text" 
                        className="bg-background rounded-md #b5b5b5 border-gray-300 border-1 py-2 px-2"/>
                    <span className="text-red-500 text-sm">
                            {errors && errors.email?.message}
                        </span>

                </label>
                <label htmlFor="password" className="flex flex-col gap-2">
                    Senha
                    <Input 
                        {...register("password")}
                        type="password"
                        className="bg-background rounded-md border-gray-300 border-1 py-2 px-2" />
                        <span className="text-red-500 text-sm">
                            {errors && errors.password?.message}
                        </span>
                </label>

                <Button  type="submit" >Fazer Login</Button>
                <div className="flex justify-between">
                    <p>Esqueci a senha</p>
                   <Link href={"/cadastro"} className="cursor-pointer hover:font-bold">Criar conta</Link>
                </div>
            </form>

        </div>
        </div>
    )
  
}