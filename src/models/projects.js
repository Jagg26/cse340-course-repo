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

export {getAllProjects}
