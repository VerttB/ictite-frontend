export const errorTypes: { [key: number]: string } = {
    400: "Requisição Inválida",
    401: "Não autorizado",
    403: "Acesso Negado",
    404: "Não encontrado",
    409: "Conflito de dados",
    500: "Erro interno do servidor",
    502: "Gateway Inválido",
    503: "Serviço Indisponível",
};

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
