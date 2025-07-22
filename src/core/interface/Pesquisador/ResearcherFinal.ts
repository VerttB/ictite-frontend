import { Article } from "./Article"
import { Researcher } from "./Researcher"
import { ResearchSIMCC } from "./ResearcherSIMCC"

export interface ResearcherFinal extends Researcher,ResearchSIMCC{
   articlesData: Article[];
}