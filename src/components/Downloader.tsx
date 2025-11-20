"use client";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/core/utils/api";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
} from "./ui/dialog";
import { DownloadIcon } from "lucide-react";
import { useViewPort } from "@/hooks/useViewPort";
const exporter = async (path: string, id?: string, file?: string) => {
    const res = await fetch(
        `${getBaseUrl()}/${path}/export${id ? `/${id}` : ""}?file=${file}`,
        {
            method: "GET",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");

    const header = res.headers.get("Content-Disposition");

    if (header) {
        const filenameMatch = header.match(/filename="?(.+)"?/);
        if (filenameMatch) {
            link.download = filenameMatch[1];
        }
    }
    if (!link.download) {
        link.download = `${path}${id ? `-${id}` : ""}`;
    }
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

interface DownloaderProps {
    path: string;
    id?: string;
}

export const Downloader = ({ path, id }: DownloaderProps) => {
    const [file, setFile] = useState<"csv" | "excel" | "json">("csv");
    const [open, setOpen] = useState(false);
    const { isMobile } = useViewPort();
    const handleDownload = () => {
        exporter(path, id, file);
        setOpen(false);
    };
    return (
        <div>
            <Button variant="default" onClick={() => setOpen(true)}>
                {isMobile ? "" : "Download"} <DownloadIcon size={16} />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogClose />
                        <DialogTitle>Selecione o Tipo de Arquivo</DialogTitle>
                    </DialogHeader>
                    <select
                        value={file}
                        onChange={(e) =>
                            setFile(e.target.value as "csv" | "excel" | "json")
                        }>
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="json">JSON</option>
                    </select>
                    <DialogFooter>
                        <Button onClick={handleDownload}>
                            Download <DownloadIcon size={16} />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
