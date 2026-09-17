import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            o.name AS organization_name,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.project_date, sp.title;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date, title;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date, sp.title
        LIMIT $1;
    `;

    const queryParams = [numberOfProjects];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
}

export {getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails}
