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

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, organizationId, title, description, location, date) => {
    const query = `
        UPDATE service_project
        SET organization_id = $1, title = $2, description = $3, location = $4, project_date = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [organizationId, title, description, location, date, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].project_id;
}

const addVolunteerToProject = async (userId, projectId) => {
    const query = `
        INSERT INTO service_project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM service_project_volunteer
        WHERE user_id = $1 AND project_id = $2
        RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const isUserVolunteeringForProject = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM service_project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
}

const getVolunteeredProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name,
            spv.volunteered_at
        FROM service_project_volunteer spv
        JOIN service_project sp
            ON spv.project_id = sp.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE spv.user_id = $1
        ORDER BY sp.project_date, sp.title;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteerToProject,
    removeVolunteerFromProject,
    isUserVolunteeringForProject,
    getVolunteeredProjectsByUserId
}
