export interface Article {
  id: string;
  title: string;
  year: number;
  type: "ARTICLE"; // Ou "ARTICLE" | "BOOK_CHAPTER" | etc. se houver outros tipos
  doi: string;
  qualis: string;
  magazine: string;
  researcher: string; // Nome do pesquisador
  lattes_10_id: string;
  lattes_id: string;
  jif: string; // Journal Impact Factor (assumindo string vazia se não houver)
  jcr_link: string; // Journal Citation Reports link
  researcher_id: string; // ID do pesquisador
  abstract: string;
  article_institution: string;
  authors: string; // Pode ser uma string ou string[] se houver vários autores
  authors_institution: string;
  citations_count: string; // Assumindo string vazia se não houver, pode ser number
  issn: string;
  keywords: string; // Pode ser uma string ou string[] se houver várias
  landing_page_url: string;
  language: string;
  pdf: string; // URL para o PDF
  has_image: boolean;
  relevance: boolean;
}