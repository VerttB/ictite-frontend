import { Researcher } from "./Researcher";

export interface ResearcherByType {
    Aluno: Researcher[];
    Professor: Researcher[];
    Coordenador: Researcher[];
}