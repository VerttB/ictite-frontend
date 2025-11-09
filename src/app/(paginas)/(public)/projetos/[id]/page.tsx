import React from 'react'
import { PesquisadoresLista } from "@/components/pesquisador/PesquisadoresLista";
import { getProjectById } from "@/core/service/ProjetoService";
import { Book, ChevronLeft, GraduationCap, Handshake, School } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;

}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return <div className="px-10 py-6">Projeto não encontrado</div>

  return(
    <div className="w-full shadow p-8">
      {/* |=======| MENU SUPERIOR DE PROJETO |=======| */}
      <div className="flex flex-col gap-3 border-b pb-3">
          <div className="flex flex-row gap-4 items-center">
            <Link href={"/"}>
                <Button size={"icon"} variant={"outline"}>
                    <ChevronLeft size={20} />
                </Button>
            </Link>
            <div className="text-4xl font-semibold">{project.name}</div>
          </div>
          <div>
            <div className="">{project.description}</div>
            <div className="flex flex-row gap-0.5 items-center text-gray-500 mt-2">
              <School size={16} />
              <span className="text-sm">{project.school}</span>
            </div>
          </div>
      </div>

      {/* |=======| IMAGENS DO PROJETO |=======| */}
      <div className="pl-5 pt-2 overflow-y-auto">
        <div className="flex flex-row gap-5 py-7 border-b">
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
        </div>
      </div>

      {/* |=======| FUTURA DESCRIÇÃO LONGA + ESTATÍSTICAS |=======| */}
      <div className="flex flex-col lg:flex-row gap-5 mt-4">

        {/* DESCRIÇÃO LONGA */}
        <div className="flex flex-col flex-3/4 gap-1 p-3 bg-foreground rounded-md  border">
          <h2 className="text-xl font-semibold border-b pb-2">Descrição Longa do Projeto</h2>
          <p className='text-justify'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo ut non. Necessitatibus, iste? Odio molestiae autem nulla nisi, ex quia eum! Voluptas rerum sapiente suscipit dignissimos delectus nulla hic?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo ut non. Necessitatibus, iste? Odio molestiae autem nulla nisi, ex quia eum! Voluptas rerum sapiente suscipit dignissimos delectus nulla hic?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo ut non. Necessitatibus, iste? Odio molestiae autem nulla nisi, ex quia eum! Voluptas rerum sapiente suscipit dignissimos delectus nulla hic?
          </p>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="flex-1/4 p-3 bg-foreground rounded-md border">
          <h2 className="text-xl font-semibold border-b pb-2">Estatísticas</h2>
          <div className="flex flex-col md:flex-row gap-4 lg:flex-col mt-2">
            <div className="flex gap-2 ">
              <Book />
              <span>Professores: XX</span>
            </div>
            <div className="flex gap-2">
              <GraduationCap />
              <span>Alunos: XX</span>
            </div>
            <div className="flex gap-2">
              <Handshake />
              <span>Facilitadores: XX</span>
            </div>
          </div>
        </div>
      </div>

      <PesquisadoresLista projectId={project.id}/>
    </div>
  )
}