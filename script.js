// theme darkmode functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
const theme = html.getAttribute('data-theme');
const newTheme = theme === 'light' ? 'dark' : 'light';

html.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// gitHub repos fetch with pinned repos prioritization
async function fetchGitHubRepos() {
const container = document.getElementById('projectsContainer');

try {
// fetch pinned repositories using GraphQL
const pinnedQuery = `
    query {
    user(login: "zionabyrke") {
        pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
            ... on Repository {
            name
            description
            url
            primaryLanguage {
                name
            }
            repositoryTopics(first: 10) {
                nodes {
                topic {
                    name
                }
                }
            }
            }
        }
        }
    }
    }
`;

const pinnedRes = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: pinnedQuery })
});

let pinnedRepos = [];
if (pinnedRes.ok) {
    const pinnedData = await pinnedRes.json();
    if (pinnedData.data && pinnedData.data.user && pinnedData.data.user.pinnedItems) {
    pinnedRepos = pinnedData.data.user.pinnedItems.nodes.map(repo => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.url,
        language: repo.primaryLanguage ? repo.primaryLanguage.name : null,
        topics: repo.repositoryTopics.nodes.map(t => t.topic.name),
        pinned: true
    }));
    }
}

// fetch all repositories
const res = await fetch('https://api.github.com/users/zionabyrke/repos?sort=updated&per_page=100');

if (!res.ok) {
    throw new Error('Failed to fetch repositories');
}

const allRepos = await res.json();
const publicRepos = allRepos.filter(r => !r.private && !r.fork);

// remove pinned repos from the all repos list to avoid duplicates
const pinnedNames = new Set(pinnedRepos.map(r => r.name));
const unpinnedRepos = publicRepos.filter(r => !pinnedNames.has(r.name));

// combine: pinned first, then unpinned
const repos = [...pinnedRepos, ...unpinnedRepos];

if (repos.length === 0) {
    container.innerHTML = '<div class="loading">No public repositories found.</div>';
    return;
}

container.innerHTML = '';

for (const repo of repos) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => window.open(repo.html_url, '_blank');
    
    if (repo.pinned) {
    const badge = document.createElement('div');
    badge.className = 'pinned-badge';
    badge.textContent = 'PINNED';
    card.appendChild(badge);
    }

    const logo = document.createElement('div');
    logo.className = 'project-logo';
    logo.textContent = repo.name.charAt(0).toUpperCase();
    
    const name = document.createElement('h3');
    name.className = 'project-name';
    name.textContent = repo.name;
    
    const desc = document.createElement('p');
    desc.className = 'project-description';
    desc.textContent = repo.description || 'No description available';
    
    const langs = document.createElement('div');
    langs.className = 'project-languages';
    
    if (repo.language) {
    const tag = document.createElement('span');
    tag.className = 'language-tag';
    tag.textContent = repo.language;
    langs.appendChild(tag);
    }
    
    if (repo.topics && repo.topics.length > 0) {
    repo.topics.slice(0, 3).forEach(topic => {
        const tag = document.createElement('span');
        tag.className = 'language-tag';
        tag.textContent = topic;
        langs.appendChild(tag);
    });
    }
    
    card.appendChild(logo);
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(langs);
    container.appendChild(card);
}
} catch (err) {
container.innerHTML = `<div class="error">Error loading repositories: ${err.message}</div>`;
}
}

fetchGitHubRepos();