"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useSWR from "swr";
import {
    School,
    MapPin,
    Building2,
    AlertCircle,
    Instagram,
    FileText,
    Map as MapIcon,
} from "lucide-react";
import {
    SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";
import { getTerritories } from "@/core/service/IdentityTerritoryService";
import { IdentityTerritory } from "@/core/domain/IdentityTerritory";
import { getSchoolLocationByCep } from "@/core/service/SchoolService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SchoolMainFieldsProps {
    form: UseFormReturn<SchoolFormDataInput>;
    readOnly?: boolean;
}

const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const getUniqueTerritoriesByCode = (territories: IdentityTerritory[]) => {
    const uniqueTerritories = new Map<number, IdentityTerritory>();
    territories.forEach((territory) => {
        if (!uniqueTerritories.has(territory.code)) {
            uniqueTerritories.set(territory.code, territory);
        }
    });
    return Array.from(uniqueTerritories.values()).sort((a, b) => a.code - b.code);
};

export function SchoolMainFields({ form, readOnly = false }: SchoolMainFieldsProps) {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = form;
    const [cepLookup, setCepLookup] = useState<{
        status: "idle" | "loading" | "success" | "error";
        message: string;
        cep: string;
    }>({ status: "idle", message: "", cep: "" });
    const cepLookupTimeoutRef = useRef<number | null>(null);
    const cepLookupRequestRef = useRef(0);
    const cepField = register("school.cep");

    const { data: territories = [] } = useSWR<IdentityTerritory[]>(
        "identity-territories",
        getTerritories
    );
    const uniqueTerritories = getUniqueTerritoriesByCode(territories);

    useEffect(() => {
        return () => {
            if (cepLookupTimeoutRef.current) {
                window.clearTimeout(cepLookupTimeoutRef.current);
            }
            cepLookupRequestRef.current += 1;
        };
    }, []);

    const handleCepLookup = (value: string) => {
        const normalizedCep = value.replace(/\D/g, "");

        if (cepLookupTimeoutRef.current) {
            window.clearTimeout(cepLookupTimeoutRef.current);
        }

        cepLookupRequestRef.current += 1;
        const requestId = cepLookupRequestRef.current;

        if (normalizedCep.length !== 8) {
            setCepLookup({ status: "idle", message: "", cep: "" });
            return;
        }

        cepLookupTimeoutRef.current = window.setTimeout(() => {
            setCepLookup({
                status: "loading",
                message: "Buscando cidade pelo CEP...",
                cep: normalizedCep,
            });

            getSchoolLocationByCep(normalizedCep)
                .then((location) => {
                    if (cepLookupRequestRef.current !== requestId) return;
                    setValue("school.city", location.city, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                    const territoryByCode =
                        location.identity_territory_code !== null &&
                        location.identity_territory_code !== undefined
                            ? uniqueTerritories.find(
                                  (territory) =>
                                      territory.code === location.identity_territory_code
                              )
                            : null;
                    setValue(
                        "school.identity_territory_id",
                        territoryByCode?.id || location.identity_territory_id || "",
                        {
                            shouldDirty: true,
                            shouldValidate: true,
                        }
                    );
                    setCepLookup({
                        status: "success",
                        message: location.identity_territory_name
                            ? `Cidade e território preenchidos pelo CEP: ${location.city} - ${location.identity_territory_name}`
                            : `Cidade preenchida pelo CEP: ${location.city}`,
                        cep: normalizedCep,
                    });
                })
                .catch(() => {
                    if (cepLookupRequestRef.current !== requestId) return;
                    setCepLookup({
                        status: "error",
                        message: "Não foi possível encontrar a cidade para este CEP.",
                        cep: normalizedCep,
                    });
                });
        }, 250);
    };

    const showCepLookupMessage = cepLookup.cep.length === 8 && Boolean(cepLookup.message);

    const cepLookupTextClass =
        cepLookup.status === "success"
            ? "text-[#088077]"
            : cepLookup.status === "error"
              ? "text-amber-600"
              : "text-font-secondary";

    return (
        <div className="bg-card w-full rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-4 text-[#088077]">
                <School size={20} />
                <h3 className="text-font-primary text-base font-bold">
                    Dados Principais da Escola
                </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Nome da Escola */}
                <div className="sm:col-span-2">
                    <label className="text-font-primary mb-1.5 block flex items-center gap-1.5 text-xs font-semibold">
                        <School size={14} className="text-[#088077]" />
                        Nome da Escola *
                    </label>
                    <input
                        type="text"
                        disabled={readOnly}
                        placeholder="Ex: Escola Estadual Professor João da Silva"
                        {...register("school.name")}
                        className="bg-background text-font-primary placeholder:text-font-secondary w-full rounded-xl border border-border px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-muted"
                    />
                    {errors.school?.name && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                            <AlertCircle size={12} />
                            {errors.school.name.message}
                        </p>
                    )}
                </div>

                {/* CEP */}
                <div>
                    <label className="text-font-primary mb-1.5 block flex items-center gap-1.5 text-xs font-semibold">
                        <Building2 size={14} className="text-[#088077]" />
                        CEP
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        disabled={readOnly}
                        placeholder="40000-000"
                        {...cepField}
                        onChange={(event) => {
                            const formattedCep = formatCep(event.target.value);
                            event.target.value = formattedCep;
                            handleCepLookup(formattedCep);
                            cepField.onChange(event);
                        }}
                        className="bg-background text-font-primary placeholder:text-font-secondary w-full rounded-xl border border-border px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-muted"
                    />
                    {showCepLookupMessage && (
                        <p className={`mt-1 text-xs font-medium ${cepLookupTextClass}`}>
                            {cepLookup.message}
                        </p>
                    )}
                </div>

                {/* Cidade */}
                <div>
                    <label className="text-font-primary mb-1.5 block flex items-center gap-1.5 text-xs font-semibold">
                        <MapPin size={14} className="text-[#088077]" />
                        Cidade
                    </label>
                    <Controller
                        control={control}
                        name="school.city"
                        render={({ field }) => (
                            <input
                                type="text"
                                disabled={readOnly}
                                placeholder="Ex: Salvador"
                                value={field.value || ""}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                ref={field.ref}
                                className="bg-background text-font-primary placeholder:text-font-secondary w-full rounded-xl border border-border px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-muted"
                            />
                        )}
                    />
                </div>

                {/* Território de Identidade */}
                <div className="sm:col-span-2">
                    <label className="text-font-primary mb-1.5 block flex items-center gap-1.5 text-xs font-semibold">
                        <MapIcon size={14} className="text-[#088077]" />
                        Território de Identidade (Opcional)
                    </label>
                    <Controller
                        control={control}
                        name="school.identity_territory_id"
                        render={({ field }) => {
                            const selectedTerritory = territories.find(
                                (territory) => territory.id === field.value
                            );
                            const selectedCode = selectedTerritory
                                ? String(selectedTerritory.code)
                                : "__none";

                            return (
                                <Select
                                    disabled={readOnly}
                                    value={selectedCode}
                                    onValueChange={(val) => {
                                        if (val === "__none") {
                                            field.onChange("");
                                            return;
                                        }

                                        const territory = uniqueTerritories.find(
                                            (item) => String(item.code) === val
                                        );
                                        field.onChange(territory?.id || "");
                                    }}>
                                    <SelectTrigger className="bg-background w-full rounded-xl border border-border px-4 py-2.5 text-sm disabled:bg-muted">
                                        <SelectValue placeholder="Selecione o território..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__none">Nenhum</SelectItem>
                                        {uniqueTerritories.map((t) => (
                                            <SelectItem key={t.code} value={String(t.code)}>
                                                {t.code} — {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                    {errors.school?.identity_territory_id && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                            <AlertCircle size={12} />
                            {errors.school.identity_territory_id.message}
                        </p>
                    )}
                </div>

                {/* URL do Instagram */}
                <div className="sm:col-span-2">
                    <label className="text-font-primary mb-1.5 block flex items-center gap-1.5 text-xs font-semibold">
                        <Instagram size={14} className="text-[#088077]" />
                        Instagram da Escola (Opcional)
                    </label>
                    <input
                        type="url"
                        disabled={readOnly}
                        placeholder="https://instagram.com/escola_exemplo"
                        {...register("school.instagram_url")}
                        className="bg-background text-font-primary placeholder:text-font-secondary w-full rounded-xl border border-border px-4 py-2.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-muted"
                    />
                </div>

                {/* Descrição da Escola */}
                <div className="sm:col-span-2">
                    <label className="text-font-primary mb-1.5 block flex items-center gap-1.5 text-xs font-semibold">
                        <FileText size={14} className="text-[#088077]" />
                        Descrição da Escola (Opcional)
                    </label>
                    <textarea
                        rows={3}
                        disabled={readOnly}
                        placeholder="Breve apresentação sobre o histórico, estrutura e valores da instituição de ensino..."
                        {...register("school.description")}
                        className="bg-background text-font-primary placeholder:text-font-secondary w-full resize-none rounded-xl border border-border p-3.5 text-sm transition-all outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 disabled:bg-muted"
                    />
                </div>
            </div>
        </div>
    );
}
