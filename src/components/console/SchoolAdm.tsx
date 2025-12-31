"use client";

import { Section } from "../Section";
import useSWR from "swr";
import {
    createSchool,
    getSchools,
    uploadSchoolImage,
} from "@/core/service/SchoolService";
import { useState } from "react";
import { School2 } from "lucide-react";
import { BaseFormModal } from "../BaseFormAddModal";
import { ControlledImageUpload } from "../ui/ControlledImageInput";
import { InputField } from "../ui/FormInputField";
import { mask } from "@/lib/maskBuilder";
import { SchoolSearchParams } from "@/core/domain/School";
import { SchoolCreate, SchoolCreateSchema } from "@/core/domain/School";
import { SearchAndFilter } from "../SearchAndFilter";
import { ItemFilterConfig } from "@/core/interface/ItemFilterConfig";
import { Pagination } from "../Pagination";

import { useUrlPagination } from "@/hooks/useUrlPagination";
interface SchoolAdmProps {
    params: SchoolSearchParams;
}

export const SchoolAdm = ({ params }: SchoolAdmProps) => {
    const {
        data: paginatedSchools,
        isLoading,
        mutate,
    } = useSWR(["schools", params], ([_, p]) => getSchools(p), {
        keepPreviousData: true,
    });
    const [open, setOpen] = useState(false);

    const { applyFilters, changePage } = useUrlPagination();

    const onSubmit = async (data: SchoolCreate) => {
        const { id } = await createSchool(data);
        const form = new FormData();
        data.images.forEach((image) => {
            form.append("images", image);
        });
        await uploadSchoolImage(id, form);
        mutate();
        setOpen(false);
    };

    const filters: ItemFilterConfig[] = [
        { label: "Nome", type: "text", value: "", key: "name" },
        { label: "Cidade", type: "text", value: "", key: "city" },
    ];
    if (!paginatedSchools) return null;

    return (
        <div className="flex h-full w-full flex-col">
            <Section
                title="Escolas"
                items={paginatedSchools.items}
                icon={<School2 />}
                onAdd={() => setOpen(true)}>
                <SearchAndFilter
                    currentParams={params as any}
                    applyParams={applyFilters}
                    mainSearchKey="name"
                    mainSearchPlaceholder="Buscar escolas"
                    filters={filters}
                />
            </Section>

            <BaseFormModal<typeof SchoolCreateSchema, SchoolCreate>
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
                title="Adicionar Escola"
                schema={SchoolCreateSchema}
                props={{ defaultValues: { images: [] } }}>
                <InputField name="name" label="Nome da Escola" />
                <InputField name="description" label="Descrição" />
                <InputField name="cep" label="CEP" mask={mask.cep} />

                <ControlledImageUpload name="images" />
            </BaseFormModal>
            <Pagination
                currentPage={paginatedSchools.page}
                onLoadMore={changePage}
                hasMoreData={paginatedSchools.page < paginatedSchools.total_pages}
                totalPages={paginatedSchools.total_pages}
            />
        </div>
    );
};
