import { getProjectDetails, getUpcomingProjects } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
        const err = new Error('Service Project Not Found');
        err.status = 404;
        next(err);
        return;
    }

    const title = project.title;
    const categories = await getCategoriesByProjectId(projectId);

    res.render('project', { title, project, categories });
};

export { showProjectsPage, showProjectDetailsPage };
