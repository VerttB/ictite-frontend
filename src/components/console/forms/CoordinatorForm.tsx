"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getClubProfessors } from "@/core/service/CoordinatorService";

interface CoordinatorFormProps {
    parentId?: string;
}

export const CoordinatorForm = ({ parentId }: CoordinatorFormProps) => {
    const { register, formState: { errors } } = useFormContext();
    const [professors, setProfessors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Busca apenas os professores elegíveis para este clube específico
    useEffect(() => {
        if (parentId) {
            getClubProfessors(parentId)
                .then((data) => setProfessors(data))
                .finally(() => setLoading(false));
        }
    }, [parentId]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Professor Coordenador</label>
                <select
                    {...register("researcher_id")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={loading}
                >
                    <option value="">Selecione um professor do clube</option>
                    {professors.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                            {prof.name}
                        </option>
                    ))}
                </select>
                {errors.researcher_id && (
                    <span className="text-xs text-red-500">
                        {String(errors.researcher_id.message)}
                    </span>
                )}
            </div>
        </div>
    );
};