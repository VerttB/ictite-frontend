import { Researcher } from "./Researcher"
import { ResearchSIMCC } from "./ResearcherSIMCC"

export interface ResearcherFinal extends Researcher{
    image: string | null
    simcc: ResearchSIMCC
}