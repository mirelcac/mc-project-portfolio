//NOT DONE:
// Button Hover
// Wawy line in bottom
// Later: In Github: Change project Name, Make sure link to github is fetched from github if not present in json, Get links and tags from github instead of json?
// Later: Move all projects to second page and only display featured projects on frontpage

import style from "./myprojects.module.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MainHeader } from "../../reusable/mainheader/mainheader"
import { SubHeader } from "../../reusable/subheader/subheader"
import myProjectsData from "../../../../myprojects.json"


export const MyProjects = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch('https://api.github.com/users/mirelcac/repos')
            .then((response) => response.json())
            .then((githubData) => {
                // Define the names of projects you want to exclude
                const excludedGithubProjects = ['Web-Fall-23', 'mc-happy-thoughts-api', 'mc-project-mongo-api', 'mc-express-api', 'project-pizza-MC', 'Business-Site-Order', 'mc-project-portfolio'];

                // Filter out unwanted GitHub projects
                const filteredGithubData = githubData.filter(project => {
                    return !excludedGithubProjects.includes(project.name.trim());
                });

                // Create a map of GitHub projects by URL for quick access
                const githubProjectsByUrl = new Map(
                    filteredGithubData.map(project => [project.html_url, project])
                );

                // Define the ID of JSON projects you want to exclude
                const excludedProjectIds = [3, 4, 5, 9, 16, 17];

                // Filter out specific projects from JSON data using IDs
                const filteredJsonProjects = myProjectsData.projects.filter(project => {
                    return !excludedProjectIds.includes(project.id);
                });

                // Debugging: log filtered data
                console.log('Filtered JSON projects:', filteredJsonProjects);


                // Merge your JSON projects with GitHub data
                const mergedProjects = filteredJsonProjects.map(jsonProject => {
                    const githubProject = githubProjectsByUrl.get(jsonProject.github);
                    if (githubProject) {
                        // Remove the GitHub project from the map if it's used
                        githubProjectsByUrl.delete(jsonProject.github);
                        return { ...githubProject, ...jsonProject };
                    }
                    return jsonProject;
                });

                // Add any remaining GitHub projects (not in JSON) at the top
                const newGithubProjects = Array.from(githubProjectsByUrl.values());
                setProjects([...newGithubProjects, ...mergedProjects]);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    return (
        <div className={style.myProjectsBox}>
            <div className={style.viewAllProjects}>
                <Link to="/all-projects" className={style.allProjectsLink}>View All Projects</Link>
            </div>
            <div className={style.projectsWrapper}>
                <MainHeader className={style.h1} mainHeading="Featured Projects" />
                <ul className={style.projectsList}>
                    {projects && projects.length > 0 ? ( // Check if projects is an array and has elements
                        projects.map((project) => (
                            <li className={style.eachProject} key={project.id}>
                                {/* Project Image */}
                                <div className={style.projectPicContainer}>
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className={style.projectPic}
                                    />
                                </div>
                                {/* Project Text Content */}
                                <div>
                                    <div className={style.eachProjectTextBox}>
                                        <SubHeader className={style.h2} subHeading={project.name} />
                                        <p className={style.pDescription}>{project.description}</p>
                                    </div>
                                    <div className={style.tags}>
                                        {project.tags && project.tags.length > 0 && (
                                            project.tags?.map((tag, index) => (
                                                <span key={index} className={style.tag}>{tag}</span>
                                            ))
                                        )}
                                    </div>
                                    {/* Project Links */}
                                    <div className={style.projectLinks}>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                                            <img src="/images/github-icon.svg" alt="GitHub" />
                                        </a>
                                        {project.netlify && (
                                            <a href={project.netlify} target="_blank" rel="noopener noreferrer">
                                                <img src="/images/netlify-icon.svg" alt="Netlify" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>No projects to display.</li> // Display a message or loading indicator if no projects
                    )}
                </ul>
            </div>
        </div>
    );
};
