import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM public.service_project_category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.service_project_category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            spc.category_id,
            spc.name
        FROM public.service_project_category spc
        JOIN public.service_project_category_assignment spca
            ON spc.category_id = spca.category_id
        WHERE spca.project_id = $1
        ORDER BY spc.name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getProjectsByCategoryId = async (categoryId) => {
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
        JOIN public.service_project_category_assignment spca
            ON sp.project_id = spca.project_id
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE spca.category_id = $1
        ORDER BY sp.project_date, sp.title;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

export {getAllCategories, getCategoryDetails, getCategoriesByProjectId, getProjectsByCategoryId}
