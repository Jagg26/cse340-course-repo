-- ========================================
-- Roles Table
-- ========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- ========================================
-- Insert initial data: Roles
-- ========================================
INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Community Center Painting Day', 'Volunteers will paint classrooms, hallways, and common areas at a neighborhood community center.', 'Mesa Community Center', '2026-08-08'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Park Bench Repair Project', 'Teams will sand, repair, and repaint damaged benches in a public park.', 'Pioneer Park', '2026-08-22'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Senior Home Ramp Build', 'Volunteers will help build accessibility ramps for senior residents with mobility needs.', 'Oakridge Senior Homes', '2026-09-05'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'School Garden Shed Installation', 'Participants will assemble and install a storage shed for school garden supplies.', 'Lincoln Elementary School', '2026-09-19'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Neighborhood Cleanup Crew', 'Volunteers will remove litter and small debris from sidewalks and shared community spaces.', 'Westside Neighborhood', '2026-10-03'),

((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Urban Garden Planting', 'Volunteers will plant vegetables and herbs in raised beds for a community food program.', 'Downtown Community Garden', '2026-08-12'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Farmers Market Food Sorting', 'Participants will sort donated produce for local families and food pantries.', 'Riverfront Farmers Market', '2026-08-26'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Composting Workshop Setup', 'Volunteers will prepare supplies, seating, and demonstration stations for a composting class.', 'GreenHarvest Learning Farm', '2026-09-09'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Community Orchard Care', 'Teams will mulch, water, and prune fruit trees in a shared neighborhood orchard.', 'Sunset Community Orchard', '2026-09-23'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'School Nutrition Garden Day', 'Volunteers will help students maintain garden beds used for nutrition lessons.', 'Roosevelt Middle School', '2026-10-07'),

((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Charity Supply Drive', 'Volunteers will collect, organize, and prepare donated supplies for local nonprofit partners.', 'UnityServe Donation Center', '2026-08-15'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Shelter Meal Service', 'Participants will prepare and serve dinner for individuals staying at a local shelter.', 'Hope House Shelter', '2026-08-29'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Backpack Packing Event', 'Volunteers will pack school supplies into backpacks for students before the school year begins.', 'Central Library Meeting Hall', '2026-09-12'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Veterans Support Letter Drive', 'Participants will write and organize appreciation letters and care packages for local veterans.', 'UnityServe Volunteer Hub', '2026-09-26'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Weekend Food Pantry Team', 'Volunteers will stock shelves, prepare grocery bags, and assist visitors at a food pantry.', 'Northside Food Pantry', '2026-10-10');

-- ========================================
-- Service Project Volunteer Join Table
-- ========================================
CREATE TABLE service_project_volunteer (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_project_volunteer_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_volunteer_project
        FOREIGN KEY (project_id)
        REFERENCES service_project (project_id)
        ON DELETE CASCADE
);

-- ========================================
-- Service Project Category Table
-- ========================================
CREATE TABLE service_project_category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Service Project and Category Join Table
-- ========================================
CREATE TABLE service_project_category_assignment (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_category_assignment_project
        FOREIGN KEY (project_id)
        REFERENCES service_project (project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category_assignment_category
        FOREIGN KEY (category_id)
        REFERENCES service_project_category (category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Project Categories
-- ========================================
INSERT INTO service_project_category (name)
VALUES
('Community Improvement'),
('Food and Agriculture'),
('Family Support');

-- ========================================
-- Assign categories to service projects
-- ========================================
INSERT INTO service_project_category_assignment (project_id, category_id)
VALUES
((SELECT project_id FROM service_project WHERE title = 'Community Center Painting Day'), (SELECT category_id FROM service_project_category WHERE name = 'Community Improvement')),
((SELECT project_id FROM service_project WHERE title = 'Park Bench Repair Project'), (SELECT category_id FROM service_project_category WHERE name = 'Community Improvement')),
((SELECT project_id FROM service_project WHERE title = 'Senior Home Ramp Build'), (SELECT category_id FROM service_project_category WHERE name = 'Community Improvement')),
((SELECT project_id FROM service_project WHERE title = 'Senior Home Ramp Build'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'School Garden Shed Installation'), (SELECT category_id FROM service_project_category WHERE name = 'Community Improvement')),
((SELECT project_id FROM service_project WHERE title = 'School Garden Shed Installation'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'Neighborhood Cleanup Crew'), (SELECT category_id FROM service_project_category WHERE name = 'Community Improvement')),

((SELECT project_id FROM service_project WHERE title = 'Urban Garden Planting'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'Farmers Market Food Sorting'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'Farmers Market Food Sorting'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'Composting Workshop Setup'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'Community Orchard Care'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'School Nutrition Garden Day'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'School Nutrition Garden Day'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),

((SELECT project_id FROM service_project WHERE title = 'Charity Supply Drive'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'Shelter Meal Service'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'Shelter Meal Service'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture')),
((SELECT project_id FROM service_project WHERE title = 'Backpack Packing Event'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'Veterans Support Letter Drive'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'Weekend Food Pantry Team'), (SELECT category_id FROM service_project_category WHERE name = 'Family Support')),
((SELECT project_id FROM service_project WHERE title = 'Weekend Food Pantry Team'), (SELECT category_id FROM service_project_category WHERE name = 'Food and Agriculture'));
