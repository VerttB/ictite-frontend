import { getSchoolEquiments, getSchoolProjects, getSchoolResearchers } from '@/core/service/School/SchoolService'
import useSWR from 'swr'

export const useSchoolResearchers = async (id: string) => {
    const { data, isLoading , error} = useSWR(id ? `school-${id}-researchers` : null, () => getSchoolResearchers(id),)


    return {
        researchers: data,
        isLoadingResearchers: isLoading,
        errorReseachers: error
    }
}

export const useSchoolProjects = async (id: string) => {
    const { data, isLoading , error} = useSWR(id ? `school-${id}-projects` : null, () => getSchoolProjects(id),)


    return {
        projects: data,
        isLoadingProjects: isLoading,
        errorProjects: error
    }
}

export const useSchoolEquipments = async (id: string) => {
    const { data, isLoading , error} = useSWR( id ? `school-${id}-equipments` : null, () => getSchoolEquiments(id),)


    return {
        equipments: data,
        isLoadingEquipments: isLoading,
        errorEquipments: error
    }
}