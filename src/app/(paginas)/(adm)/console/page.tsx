"use client";

import CardEntidade from "@/components/card/CardEntidade";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { School } from "@/core/domain/School";
import { getSchools } from "@/core/service/SchoolService";
import {
    Book,
    BookOpen,
    ChevronLeft,
    ClipboardList,
    Cpu,
    File,
    FileText,
    Folder,
    Milestone,
    Newspaper,
    Save,
    School2,
    Upload,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type EntidadeType =
    | "escola"
    | "revista"
    | "material"
    | "pesquisador"
    | "projeto"
    | "equipamento";

export default function Console() {
    const [entidadeSelecionada, setEntidadeSelecionada] =
        useState<EntidadeType | null>(null);
    const [escolaSelecionada, setEscolaSelecionada] = useState<string | null>(
        null
    );
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState(false);
    const [schoolsError, setSchoolsError] = useState<string | null>(null);

    const entidades = [
        {
            nome: "Escola",
            icon: School2,
            campos: ["name", "city", "descriprion", "cep"],
            abas: [
                {
                    nome: "Pesquisador",
                    campos: ["name", "lattes_id", "type", "sex", "race"],
                },
                { nome: "Projeto", campos: ["name", "descrition"] },
                { nome: "Equipamento", campos: ["name"] },
            ],
        },
        {
            nome: "Revista",
            icon: Newspaper,
            campos: ["title", "link", "description"],
        },
        {
            nome: "Material",
            icon: BookOpen,
            campos: ["title", "link", "description"],
        },
        {
            nome: "Pesquisador",
            icon: Book,
            campos: ["name", "lattes_id", "type", "sex", "race"],
        },
        {
            nome: "Projeto",
            icon: Folder,
            campos: ["name", "descrition"],
            abas: [
                {
                    nome: "Pesquisador",
                    campos: ["name", "lattes_id", "type", "sex", "race"],
                },
            ],
        },
        { nome: "Equipamento", icon: Cpu, campos: ["name"] },
    ];
    //Entidade[] = ["escola", "revista", "material", "pesquisador", "projeto", "equipamento"];

    // |=======| USEREF |=======|
    const fileInputRef = useRef<HTMLInputElement>(null);

    // |=======| USEEFFECT |=======|
    useEffect(() => {
        // CARREGANDO AS ESCOLAS:
        const loadSchools = async () => {
            setSchoolsLoading(true);
            setSchoolsError(null);
            try {
                const data = await getSchools();
                setSchools(data || []);
            } catch (err: unknown) {
                console.error("Erro ao buscar escolas:", err);
                setSchoolsError("Não foi possível carregar as escolas.");
                setSchools([]);
            } finally {
                setSchoolsLoading(false);
            }
        };

        loadSchools();
    }, []);

    // |=======| ABRIR ARQUIVO DO PC |=======|
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const extension = file.name.split(".").pop()?.toLowerCase();

        // Validar tipo de arquivo
        if (extension !== "csv" && extension !== "xlsx") {
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

    // |=======| UPLOAD DO ARQUIVO |=======|
    const handleUpload = async () => {
        if (!arquivo) {
            toast.error("Selecione um arquivo primeiro.");
            return;
        }
        if (!entidadeSelecionada) {
            toast.error("Selecione a entidade.");
            return;
        }

        const formData = new FormData();
        formData.append("file", arquivo);

        if (escolaSelecionada) formData.append("school_id", escolaSelecionada);

        let rotaBase: string = "";

        if (entidadeSelecionada === "escola") rotaBase = "schools";
        else if (entidadeSelecionada === "pesquisador")
            rotaBase = "researchers";
        else if (entidadeSelecionada === "equipamento") rotaBase = "equipment";
        else if (entidadeSelecionada === "projeto") rotaBase = "projects";
        else if (entidadeSelecionada === "revista") rotaBase = "magazine";
        else if (entidadeSelecionada === "material") rotaBase = "material";

        try {
            const backendBase = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${backendBase}/${rotaBase}/import`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(`Erro: ${err.detail || res.statusText}`);
                return;
            }

            const result = await res.json();

            toast.success(
                `Importados: ${result.imported}. Erros: ${result.errors?.length || 0}`
            );
        } catch (err) {
            console.error(err);
            toast.error("Erro ao enviar arquivo.");
        }
    };

    return (
        <div className="flex w-full flex-col gap-8 px-8 py-4">
            {/* |=======| MENU SUPERIOR - CONSOLE |=======| */}
            <div className="flex w-full flex-row justify-between">
                <div className="flex flex-row items-center gap-5">
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="cursor-pointer">
                        <ChevronLeft />
                    </Button>
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
                    <div className="flex flex-row gap-3">
                        <Button
                            onClick={handleUpload}
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            className={`bg-primary flex items-center gap-2 rounded-md px-4 py-2 text-white hover:cursor-pointer`}>
                            <Save size={18} />
                            <span className="text-sm">Salvar</span>
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            className={`bg-primary flex items-center gap-2 rounded-md px-4 py-2 text-white hover:cursor-pointer`}>
                            <Upload size={18} />
                            <span className="text-sm">Carregar Arquivo</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* |=======| FILTRO (SELECT) |=======| */}
            <div className="bg-foreground grid grid-cols-1 gap-5 rounded-sm border-2 p-4 md:grid-cols-2">
                <div className="flex flex-row items-center gap-2">
                    <p className="font-semibold">Entidade: </p>
                    <Select
                        onValueChange={(value) => {
                            setEntidadeSelecionada(value as EntidadeType);
                        }}>
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Selecione a entidade" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Entidade</SelectLabel>
                                {entidades.map((entidade) => (
                                    <SelectItem
                                        key={entidade.nome}
                                        value={entidade.nome.toLowerCase()}>
                                        {entidade.nome}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {(entidadeSelecionada === "pesquisador" ||
                    entidadeSelecionada === "projeto" ||
                    entidadeSelecionada === "equipamento") && (
                    <div className="flex flex-row items-center gap-2">
                        <p className="w-24 font-semibold">Escola:</p>
                        <Select
                            onValueChange={(value) =>
                                setEscolaSelecionada(value)
                            }
                            value={escolaSelecionada || undefined}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue
                                    placeholder={
                                        schoolsLoading
                                            ? "Carregando..."
                                            : "Selecione a escola"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Escolas</SelectLabel>
                                    {schoolsLoading && (
                                        <SelectItem value="loading" disabled>
                                            Carregando...
                                        </SelectItem>
                                    )}

                                    {schoolsError && (
                                        <SelectItem value="error" disabled>
                                            {schoolsError}
                                        </SelectItem>
                                    )}

                                    {!schoolsLoading &&
                                        !schoolsError &&
                                        schools.length === 0 && (
                                            <SelectItem value="empty" disabled>
                                                Sem escolas cadastradas
                                            </SelectItem>
                                        )}

                                    {!schoolsLoading &&
                                        !schoolsError &&
                                        schools.map((escola) => (
                                            <SelectItem
                                                key={escola.id}
                                                value={escola.id}>
                                                {escola.name}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* |=======| VISUALIZAÇÃO DE QUANDO O ARQUIVO NÃO TIVER SIDO SELECIONADO |======= */}
            {!arquivo && (
                <div className="flex items-center justify-center rounded-md border-4 border-dashed p-11">
                    <div className="flex flex-col items-center gap-2">
                        <File size={35} className="text-primary" />
                        <div className="relative">
                            <h4 className="truncate text-lg">
                                Nenhum arquivo foi selecionado ainda
                            </h4>
                            <p className="absolute top-5 text-sm text-gray-400">
                                Selecione um arquivo .csv ou .xml
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* |=======| PRÉ-VISUALIZAÇÃO DO ARQUIVO |======= */}
            {arquivo && (
                <div className="flex flex-row items-center justify-between rounded-md border bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <FileText size={22} className="text-primary" />
                        <div>
                            <p className="text-sm font-medium">
                                {arquivo.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(arquivo.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="hover:bg-red-100 hover:text-red-600">
                        <X size={18} />
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* |=======| INSTRUÇÕES PARA SABER MEXER NO CONSOLE |=======| */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-5">
                        <ClipboardList />
                        <h2 className="text-xl font-semibold">Instruções</h2>
                    </div>
                    <div>
                        <ul className="list-outside list-decimal space-y-2 pl-5">
                            <li>
                                Selecione a <strong>entidade</strong> desejada
                                no campo de opções.
                            </li>
                            <li>
                                Se necessário, escolha também a{" "}
                                <strong>escola</strong> vinculada.
                            </li>
                            <li>
                                Caso tenha dúvida de como deve ficar o arquivo,{" "}
                                <strong>visualize em entidades</strong>
                            </li>
                            <li>
                                Carregue o arquivo clicando em{" "}
                                <strong>Carregar Arquivo</strong>.
                            </li>
                            <li>
                                Confira a lista de arquivos selecionados e
                                clique em <strong>Salvar</strong> para enviar.
                            </li>
                            <li>
                                Ao final, será exibido um resumo com a
                                quantidade de registros{" "}
                                <strong>importados</strong> e os{" "}
                                <strong>erros encontrados</strong>, se houver.
                            </li>
                        </ul>
                    </div>
                </div>
                {/* |=======| LISTA DOS CARDS DE EXEMPLO DAS ENTIDADES DE CADASTRO |=======| */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-5">
                        <Milestone />
                        <h2 className="text-xl font-semibold">Entidades</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {entidades.map((entidade) => (
                            <CardEntidade
                                key={entidade.nome}
                                entidade={entidade}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
