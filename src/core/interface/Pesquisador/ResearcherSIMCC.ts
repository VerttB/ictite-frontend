import { Bolsistas } from "./IBolsistas"
import { Departments } from "./IDepartments"
import { Researcher } from "./IResearcher"
import { Ufmg } from "./IUFMG"
import { User } from "./IUser"
import { ResearchGroups } from "./ResearcherGroups"


export interface  ResearchSIMCC extends Researcher{
  among: number,
  articles: number,
  institution_id:string
  book: number,
  book_chapters: number,
  id: string,
  name: string,
  university: string,
  lattes_id: string,
  area: string,
  lattes_10_id: string,
  abstract: string,
  city: string,
  orcid: string,
  image: string
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
  ind_prod: string
  h_index: string,
  relevance_score: string,
  works_count: string,
  cited_by_count: string,
  i10_index: string,
  scopus: string,
  openalex: string,
  classification: string
  subsidy: Bolsistas[]
  graduate_programs: GraduatePrograms[]
  departments: Departments[]
  research_groups: ResearchGroups[]
  status: boolean
  ufmg: Ufmg
  user:User
  abstract_ai:string
}