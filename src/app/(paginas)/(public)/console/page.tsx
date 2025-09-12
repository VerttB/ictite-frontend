'use client'

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Entidade = "escola" | "revista" | "material" | "pesquisador" | "projeto" | "equipamento";

export default function Console () {

    const [entidadeSelecionada, setEntidadeSelecionada] = useState<Entidade | null>(null);
    const [escolaSelecionada, setEscolaSelecionada] = useState<string | null>(null);
    const [arquivo, setArquivo] = useState<File | null>(null);

    // |=======| DADOS MOCK |=======|
    const escolas = [
        { id: "1", nome: "Escola Municipal A" },
        { id: "2", nome: "Colégio Estadual B" },
        { id: "3", nome: "Instituto Federal C" },
    ];

    const entidades: Entidade[] = ["escola", "revista", "material", "pesquisador", "projeto", "equipamento"];

    // |=======| USEREF |=======|
    const fileInputRef = useRef<HTMLInputElement>(null);

    // |=======| ABRIR ARQUIVO DO PC |=======|
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const extension = file.name.split('.').pop()?.toLowerCase();

        // Validar tipo de arquivo
        if (extension !== 'csv' && extension !== 'xlsx') {
            toast.error("Formato não suportado. Use CSV ou XLSX.");
            return;
        }

        setArquivo(file);
        
    };

    // |=======| REMOVER ARQUIVO |=======|
    const handleRemoveFile = () => {
        setArquivo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // limpa o input
        }
    };

    return(
        <div className="flex flex-col gap-8 w-full px-8 py-4">
            {/* |=======| MENU SUPERIOR - CONSOLE |=======| */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-5 items-center">
                    <Button variant={"outline"} size={"icon"} className="cursor-pointer"><ChevronLeft /></Button>
                    <h2 className="text-2xl font-semibold">Console</h2>
                </div>
                
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".csv,.xlsx"
                        className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}
                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                        className={`
                            flex rounded-md gap-2 items-center px-4 py-2
                            bg-verde text-white
                            hover:cursor-pointer
                        `}
                    >
                        <Upload size={18} />
                        <span className="text-sm">Carregar Arquivo</span>
                    </Button>
                </div>
            </div>

            {/* |=======| FILTRO (SELECT) |=======| */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-cinza-light rounded-sm p-4 border-2">
                <div className="flex flex-row gap-2 items-center">
                    <p className="font-semibold">Entidade: </p>
                    <Select
                        onValueChange={(value) => {
                            setEntidadeSelecionada(value as Entidade);
                        }}
                    >
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Selecione a entidade" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Entidade</SelectLabel>
                                {entidades.map(entidade => (
                                    <SelectItem key={entidade} value={entidade}>{entidade}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {(entidadeSelecionada === "pesquisador" || entidadeSelecionada === "projeto" || entidadeSelecionada === "equipamento") && (
                    <div className="flex flex-row gap-2 items-center">
                        <p className="font-semibold w-24">Escola:</p>
                        <Select
                            onValueChange={(value) => setEscolaSelecionada(value)}
                            value={escolaSelecionada || undefined}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Selecione a escola" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Escolas</SelectLabel>
                                    {escolas.map((escola) => (
                                    <SelectItem key={escola.id} value={escola.id}>
                                        {escola.nome}
                                    </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* |=======| PRÉ-VISUALIZAÇÃO DO ARQUIVO |======= */}
            {arquivo && (
                <div className="flex flex-row items-center justify-between bg-white border rounded-md shadow-sm px-4 py-3">
                    <div className="flex items-center gap-3">
                        <FileText size={22} className="text-verde" />
                        <div>
                            <p className="text-sm font-medium">{arquivo.name}</p>
                            <p className="text-xs text-gray-500">{(arquivo.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleRemoveFile}
                        className="hover:bg-red-100 hover:text-red-600"
                    >
                        <X size={18} />
                    </Button>
                </div>
            )}
        </div>
    );
}