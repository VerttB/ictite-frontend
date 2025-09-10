import { Project } from '@/core/interface/Project'
import { getSchoolEquiments, getSchoolProjects, getSchoolResearchers } from '@/core/service/School/SchoolService'
import useSWR from 'swr'

export const useSchoolResearchers = (id: string) => {
    const { data, isLoading , error} = useSWR(id ? `school-${id}-researchers` : null, () => getSchoolResearchers(id),)


    return {
        researchers: data,
        isLoading,
        errorReseachers: error
    }
}

export const useSchoolProjects = (id: string) => {
    const { data, isLoading , error} = useSWR<Project[]>(id ? `school-${id}-projects` : null, () => getSchoolProjects(id),)


    return {
        projects: data,
        isLoading,
        errorProjects: error
    }
}

export const useSchoolEquipments = (id: string) => {
    const { data, isLoading , error} = useSWR( id ? `school-${id}-equipments` : null, () => getSchoolEquiments(id),)


    return {
        equipments: data,
        isLoading,
        errorEquipments: error
    }
}