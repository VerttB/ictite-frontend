/**
 * Normaliza URLs do Instagram para garantir consistência.
 * Aceita: @usuario, usuario, https://instagram.com/usuario, https://www.instagram.com/usuario/
 * Retorna: https://instagram.com/usuario
 */
export function formatInstagramUrl(input: string | undefined | null): string {
    if (!input || !input.trim()) return "";

    const trimmed = input.trim();

    // Se já é uma URL completa do Instagram, extrair o username
    const urlPatterns = [
        /^https?:\/\/(www\.)?instagram\.com\/([^/?#]+)/i,
        /^https?:\/\/(www\.)?instagr\.am\/([^/?#]+)/i,
    ];

    for (const pattern of urlPatterns) {
        const match = trimmed.match(pattern);
        if (match && match[2]) {
            const username = match[2].replace(/\/$/, ""); // remove trailing slash
            return `https://instagram.com/${username}`;
        }
    }

    // Se começa com @, remover o @
    if (trimmed.startsWith("@")) {
        return `https://instagram.com/${trimmed.slice(1)}`;
    }

    // Assumir que é apenas o username
    return `https://instagram.com/${trimmed}`;
}

/**
 * Extrai apenas o username do Instagram para exibição.
 */
export function getInstagramUsername(input: string | undefined | null): string {
    if (!input || !input.trim()) return "";

    const trimmed = input.trim();

    const urlPatterns = [
        /^https?:\/\/(www\.)?instagram\.com\/([^/?#]+)/i,
        /^https?:\/\/(www\.)?instagr\.am\/([^/?#]+)/i,
    ];

    for (const pattern of urlPatterns) {
        const match = trimmed.match(pattern);
        if (match && match[2]) {
            return match[2].replace(/\/$/, "");
        }
    }

    if (trimmed.startsWith("@")) {
        return trimmed.slice(1);
    }

    return trimmed;
}