"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { ZodType } from "zod";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";
import { Section } from "../../Section";
import { AdminEntityConfig } from "@/core/interface/AdminEntity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, LoaderCircle } from "lucide-react";
import { useAdmCrud } from "@/hooks/useAdmCrud";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { Pagination } from "../../Pagination";
import { SearchAndFilter } from "../../SearchAndFilter";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "../../DeleteConfirmationModal";

interface EntityConsoleProps<
    T extends { id: string },
    CreateDTO,
    UpdateDTO,
    TSchema extends ZodType<any, any, any>,
> {
    config: AdminEntityConfig<T, CreateDTO, UpdateDTO, TSchema>;
    params: any;
}

export const EntityConsole = <
    T extends { id: string },
    CreateDTO,
    UpdateDTO,
    TSchema extends ZodType<any, any, any>,
>({
    config,
    params,
}: EntityConsoleProps<T, CreateDTO, UpdateDTO, TSchema>) => {
    const [view, setView] = useState<"list" | "edit">("list");
    const [activeTab, setActiveTab] = useState("dados-gerais");

    const {
        data: paginatedData,
        mutate,
        error,
    } = useSWR([config.entityName, params], ([, p]) => config.fetchFn(p), {
        keepPreviousData: true,
    });

    const { applyFilters, changePage } = useUrlPagination();

    const crud = useAdmCrud<T, CreateDTO, UpdateDTO>({
        mutate,
        createFn: config.createFn,
        updateFn: config.updateFn,
        deleteFn: config.deleteFn,
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        const base: BreadcrumbItem[] = [{ label: config.title }];
        if (view === "edit") {
            base[0].href = `/console/v2/${config.entityName}`;
            base.push({ label: crud.editingItem ? "Editar" : "Novo" });
        }
        return base;
    }, [config.title, config.entityName, view, crud.editingItem]);

    const methods = useForm({
        resolver: zodResolver(config.schema),
        defaultValues: config.defaultValues as any,
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    const onOpenCreate = () => {
        reset(config.defaultValues as any);
        crud.ui.openCreate();
        setView("edit");
        setActiveTab("dados-gerais");
    };

    const onOpenEdit = (item: T) => {
        const formValues = config.mapToFormValues ? config.mapToFormValues(item) : item;
        reset(formValues as any);
        crud.ui.openEdit(item);
        setView("edit");
        setActiveTab("dados-gerais");
    };

    const onBackToList = () => {
        setView("list");
        crud.ui.closeEdit();
        crud.ui.closeCreate();
    };

    const handleFormSubmit = async (data: any) => {
        let success = false;
        if (crud.editingItem) {
            success = await crud.actions.update(data);
        } else {
            const result = await config.createFn(data as any);
            if (result && result.id) {
                await mutate();
                if ((result as any)._redirectToList) {
                    onBackToList();
                } else {
                    crud.ui.openEdit(result); // Switch to edit mode after creation to unlock tabs
                }
                success = true;
                toast.success("Item criado com sucesso!");
            }
        }
        return success;
    };

    if (view === "list") {
        return (
            <div className="flex h-full w-full flex-col">
                <Breadcrumbs items={breadcrumbs} />
                <Section<any>
                    title={config.title}
                    items={paginatedData?.items || []}
                    onAdd={onOpenCreate}
                    onUpdate={onOpenEdit}
                    onDelete={crud.ui.openDelete}>
                    <SearchAndFilter
                        currentParams={params}
                        applyParams={applyFilters}
                        mainSearchKey="name"
                        mainSearchPlaceholder={`Buscar ${config.title.toLowerCase()}`}
                        filters={[]}
                    />
                </Section>
                <Pagination
                    currentPage={paginatedData?.page || 1}
                    onLoadMore={changePage}
                    totalPages={paginatedData?.total_pages || 1}
                />
                <DeleteConfirmationModal
                    open={!!crud.deletingItem}
                    onClose={crud.ui.closeDelete}
                    onConfirm={crud.actions.delete}
                    title={`Deseja excluir ${(crud.deletingItem as any)?.name ?? "este item"}?`}
                    description="Essa ação não pode ser desfeita."
                />
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex flex-col">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="text-2xl font-bold">
                        {crud.editingItem
                            ? `Editar ${config.title}`
                            : `Novo ${config.title}`}
                    </h1>
                </div>
                <Button variant="outline" onClick={onBackToList}>
                    <ArrowLeft className="mr-2" size={16} />
                    Voltar para lista
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="overflow-x-auto pb-2">
                    <TabsList
                        className="inline-flex w-full min-w-max md:grid"
                        style={{
                            gridTemplateColumns: `repeat(${crud.editingItem && config.childTabs?.length ? config.childTabs.length + 1 : 1}, 1fr)`,
                        }}>
                        <TabsTrigger className="text-font-primary px-4" value="dados-gerais">
                            Dados Gerais
                        </TabsTrigger>
                        {crud.editingItem &&
                            config.childTabs?.map((tab) => (
                                <TabsTrigger
                                    className="text-font-primary px-4"
                                    key={tab.id}
                                    value={tab.id}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                    </TabsList>
                </div>

                <TabsContent value="dados-gerais" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do {config.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormProvider {...methods}>
                                <form
                                    onSubmit={handleSubmit(handleFormSubmit)}
                                    className="space-y-4">
                                    {config.renderForm({ methods })}
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onBackToList}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <LoaderCircle className="mr-2 animate-spin" />
                                            ) : null}
                                            {crud.editingItem ? "Atualizar" : "Criar"}
                                        </Button>
                                    </div>
                                </form>
                            </FormProvider>
                        </CardContent>
                    </Card>
                </TabsContent>

                {crud.editingItem &&
                    config.childTabs?.map((tab) => (
                        <TabsContent key={tab.id} value={tab.id} className="mt-6">
                            {tab.renderList(crud.editingItem!.id)}
                        </TabsContent>
                    ))}
            </Tabs>
        </div>
    );
};
