import { Equipment } from "../Equipment";
import { Researcher } from "../Pesquisador/Researcher";
import { Project } from "../Project";
import { SchoolData } from "./School";

export interface SchoolFull extends SchoolData{
    researchers: Researcher[],
    projects: Project[],
    equipment: Equipment[]
}