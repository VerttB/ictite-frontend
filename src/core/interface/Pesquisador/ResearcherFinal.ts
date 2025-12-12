import { Project } from "../Project";
import { Article } from "./Article";
import { Researcher } from "./Researcher";
import { ResearchSIMCC } from "./ResearcherSIMCC";

export interface ResearcherFinal extends Researcher {
    projects: Record<string,
     Pick<Project, "id" | "name" | "description">[]>;
    articles: Article[];
    simcc: ResearchSIMCC;
}
