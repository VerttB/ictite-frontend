import { useFormContext, Controller, useWatch } from "react-hook-form";
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
import React, { useMemo, useState } from "react";

type OptionType = { value: string; label: string };

interface ControlledComboBoxProps {
    name: string;
    label: string;
    isMulti?: boolean;
    options: SimpleIdName[] | string[] | number[];
    className?: string;
    truncateLabels?: boolean;
    disabled?: boolean;
    lockedValue?: OptionType | null;
    onSearchChange?: (value: string) => void;
}

export const ControlledComboBox = ({
    name,
    label,
    options,
    className = "",
    isMulti = false,
    truncateLabels = false,
    disabled = false,
    lockedValue = null,
    onSearchChange,
}: ControlledComboBoxProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const anchor = useComboboxAnchor();

    const [searchValue, setSearchValue] = useState(lockedValue ? lockedValue.label : "");

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

    const rhfValue = useWatch({ name, control });

    // Sync search value with selected label when editing or reset
    React.useEffect(() => {
        // If value is cleared (reset), clear the search text
        if (!rhfValue || (Array.isArray(rhfValue) && rhfValue.length === 0)) {
            if (!lockedValue) {
                setSearchValue("");
            }
            return;
        }

        // If single select and we have a value, sync the label if not already typing
        if (!isMulti && rhfValue) {
            const selected = normalizedOptions.find(
                (o) => o.value === rhfValue.toString()
            );
            
            // Only sync if the search text is empty (initial load) or 
            // if it's completely different from the current value's label 
            // (meaning the value changed externally)
            if (selected && (!searchValue || searchValue !== selected.label)) {
                // If the user just cleared the input manually but didn't select a new value yet, 
                // we might want to be careful here, but usually reset() is the main case.
                setSearchValue(selected.label);
            }
        }
    }, [rhfValue, normalizedOptions, isMulti, lockedValue]);

    return (
        <div className={`${className}`}>
            <label className="mb-1 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const currentFieldValue = field.value;
                    const displayValue = (() => {
                        if (isMulti) {
                            if (lockedValue) return [lockedValue];
                            const arr = Array.isArray(currentFieldValue)
                                ? currentFieldValue
                                : [];
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
                            if (!currentFieldValue) return null;
                            if (lockedValue) {
                                return lockedValue;
                            } // Se tiver valor travado, usar ele como display
                            return (
                                normalizedOptions.find(
                                    (o) => o.value === currentFieldValue?.toString()
                                ) || {
                                    value: currentFieldValue?.toString(),
                                    label: currentFieldValue?.toString(),
                                }
                            );
                        }
                    })();

                    return (
                        <Combobox
                            inputRef={field.ref}
                            items={filteredOptions}
                            value={displayValue}
                            multiple={isMulti}
                            inputValue={searchValue}
                            onInputValueChange={(arg1: unknown, arg2: unknown) => {
                                const text =
                                    typeof arg1 === "string"
                                        ? arg1
                                        : typeof arg2 === "string"
                                          ? arg2
                                          : "";
                                setSearchValue(text);
                                if (onSearchChange) onSearchChange(text);
                            }}
                            onValueChange={(val: OptionType | OptionType[] | null) => {
                                setSearchValue("");

                                if (!val) {
                                    field.onChange(isMulti ? [] : null);
                                    return;
                                }

                                if (isMulti) {
                                    const ids = Array.isArray(val)
                                        ? val.map((item) => item.value)
                                        : [];
                                    field.onChange(ids);
                                } else {
                                    field.onChange(Array.isArray(val) ? null : val.value);
                                }
                            }}>
                            {isMulti ? (
                                <ComboboxChips
                                    className="text-font-primary border-slate-300 text-lg"
                                    ref={anchor}>
                                    <ComboboxValue>
                                        {(values: typeof normalizedOptions) => (
                                            <>
                                                {values.map((value) => (
                                                    <ComboboxChip
                                                        className={`text-font-primary ${
                                                            truncateLabels
                                                                ? "max-w-64 overflow-hidden"
                                                                : ""
                                                        }`}
                                                        title={
                                                            truncateLabels
                                                                ? value.label
                                                                : undefined
                                                        }
                                                        key={value.value}>
                                                        <span
                                                            className={
                                                                truncateLabels
                                                                    ? "truncate"
                                                                    : undefined
                                                            }>
                                                            {value.label}
                                                        </span>
                                                    </ComboboxChip>
                                                ))}
                                                <ComboboxChipsInput
                                                    placeholder={`Selecione ${label.toLowerCase()}`}
                                                    disabled={disabled}
                                                />
                                            </>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>
                            ) : (
                                <ComboboxInput
                                    placeholder={`Selecione ${label.toLowerCase()}`}
                                    disabled={disabled}
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
                                                title={
                                                    truncateLabels ? opt.label : undefined
                                                }
                                                value={opt}
                                                onPointerDown={(e) => e.preventDefault()}>
                                                <span
                                                    className={
                                                        truncateLabels
                                                            ? "block max-w-[24rem] truncate"
                                                            : undefined
                                                    }>
                                                    {opt.label}
                                                </span>
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
