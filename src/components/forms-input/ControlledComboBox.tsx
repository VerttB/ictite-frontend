import { useFormContext, Controller } from "react-hook-form";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox";

import { SimpleIdName } from "@/schemas/Common";
import { useMemo, useState } from "react";

type OptionType = { value: string; label: string };

interface ControlledComboBoxProps {
    name: string;
    label: string;
    isMulti?: boolean;
    options: SimpleIdName[] | string[] | number[];
    className?: string;
}

export const ControlledComboBox = ({
    name,
    label,
    options,
    className = "",
    isMulti = false,
}: ControlledComboBoxProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const anchor = useComboboxAnchor();

    const [searchValue, setSearchValue] = useState("");

    const normalizedOptions: OptionType[] = useMemo(() => {
        return options.map((opt) => {
            if (typeof opt === "object" && opt !== null && "id" in opt && "name" in opt) {
                return { value: opt.id.toString(), label: opt.name };
            }
            return { value: opt.toString(), label: opt.toString() };
        });
    }, [options]);

    const filteredOptions = useMemo(() => {
        if (!searchValue) return normalizedOptions;
        const lowerSearch = searchValue.toLowerCase();
        return normalizedOptions.filter((opt) =>
            opt.label.toLowerCase().includes(lowerSearch)
        );
    }, [normalizedOptions, searchValue]);

    return (
        <div className={`${className}`}>
            <label className="mb-1 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const rhfValue = field.value;
                    const displayValue = useMemo(() => {
                        if (isMulti) {
                            const arr = Array.isArray(rhfValue) ? rhfValue : [];
                            return arr.map(
                                (id) =>
                                    normalizedOptions.find(
                                        (o) => o.value === id?.toString()
                                    ) || {
                                        value: id?.toString(),
                                        label: id?.toString(),
                                    }
                            );
                        } else {
                            if (!rhfValue) return null;
                            return (
                                normalizedOptions.find(
                                    (o) => o.value === rhfValue?.toString()
                                ) || {
                                    value: rhfValue?.toString(),
                                    label: rhfValue?.toString(),
                                }
                            );
                        }
                    }, [rhfValue, isMulti, normalizedOptions]);

                    return (
                        <Combobox
                            inputRef={field.ref}
                            items={filteredOptions}
                            value={displayValue}
                            multiple={isMulti}
                            inputValue={searchValue}
                            onInputValueChange={(arg1: any, arg2: any) => {
                                const text =
                                    typeof arg1 === "string"
                                        ? arg1
                                        : typeof arg2 === "string"
                                          ? arg2
                                          : "";
                                setSearchValue(text);
                            }}
                            onValueChange={(val: any) => {
                                setSearchValue("");

                                if (!val) {
                                    field.onChange(isMulti ? [] : null);
                                    return;
                                }

                                if (isMulti) {
                                    const ids = val.map((item: any) => item.value);
                                    field.onChange(ids);
                                } else {
                                    field.onChange(val.value);
                                }
                            }}>
                            {isMulti ? (
                                <ComboboxChips
                                    className="text-font-primary border-slate-300"
                                    ref={anchor}>
                                    <ComboboxValue>
                                        {(values: typeof normalizedOptions) => (
                                            <>
                                                {values.map((value) => (
                                                    <ComboboxChip
                                                        className="text-font-primary"
                                                        key={value.value}>
                                                        {value.label}
                                                    </ComboboxChip>
                                                ))}
                                                <ComboboxChipsInput
                                                    placeholder={`Selecione ${label.toLowerCase()}`}
                                                />
                                            </>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>
                            ) : (
                                <ComboboxInput
                                    placeholder={`Selecione ${label.toLowerCase()}`}
                                />
                            )}

                            <ComboboxContent
                                anchor={isMulti ? anchor : undefined}
                                className="pointer-events-auto z-[9999]">
                                {filteredOptions.length === 0 ? (
                                    <ComboboxEmpty>
                                        Nenhuma opção encontrada
                                    </ComboboxEmpty>
                                ) : (
                                    <ComboboxList>
                                        {filteredOptions.map((opt) => (
                                            <ComboboxItem
                                                key={opt.value}
                                                value={opt}
                                                onPointerDown={(e) => e.preventDefault()}>
                                                {opt.label}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxList>
                                )}
                            </ComboboxContent>
                        </Combobox>
                    );
                }}
            />

            {errors[name] && (
                <p className="mt-1 text-sm text-red-500">
                    {errors[name].message as string}
                </p>
            )}
        </div>
    );
};
