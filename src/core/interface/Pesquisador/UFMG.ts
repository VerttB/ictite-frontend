export interface Ufmg {
    id: string;
    full_name: string;
    gender: string | null;
    status_code: string;
    work_regime: string;
    job_class: string;
    job_title: string;
    job_rank: string;
    job_reference_code: string;
    academic_degree: string;
    organization_entry_date: string; // formato ISO: "YYYY-MM-DD"
    last_promotion_date: string;
    employment_status_description: string;
    department_name: string;
    career_category: string;
    academic_unit: string;
    unit_code: string;
    function_code: string;
    position_code: string;
    leadership_start_date: string;
    leadership_end_date: string;
    current_function_name: string;
    function_location: string;
    registration_number: string;
    ufmg_registration_number: string;
    semester_reference: string;
}
