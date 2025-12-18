import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Project } from "@/core/interface/Project";
import { getSchoolEquiments, getSchoolProjects, getSchoolResearchers } from "@/core/service/SchoolService";
import useSWR from "swr";

export const useSchoolResearchers = (id: string) => {
    const { data, isLoading, error } = useSWR<Researcher[]>(
        id ? `school-${id}-researchers` : null,
        () => getSchoolResearchers(id)
    );

    return {
        researchers: data,
        isLoading,
        errorReseachers: error,
    };
};

export const useSchoolProjects = (id: string) => {
    const { data, isLoading, error } = useSWR<Project[]>(
        id ? `school-${id}-projects` : null,
        () => getSchoolProjects(id)
    );

    return {
        projects: data,
        isLoading,
        errorProjects: error,
    };
};

export const useSchoolEquipments = (id: string) => {
    const { data, isLoading, error } = useSWR(
        id ? `school-${id}-equipments` : null,
        () => getSchoolEquiments(id)
    );

    return {
        equipments: data,
        isLoading,
        errorEquipments: error,
    };
};

// export const useSchoolStatistcs = (id: string) => {
//     const { data, isLoading, error } = useSWR(
//         id ? `school-${id}-statistics` : null,
//         () => getSchoolStatistics(id)
//     );
//     return {
//         statistics: data,
//         isLoading,
//         errorStatistics: error,
//     };
// };
