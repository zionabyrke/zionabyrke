// gitHub repos fetch
async function fetchGitHubRepos() {
    const container = document.getElementById('projectsContainer');
    
    try {
    const res = await fetch('https://api.github.com/users/zionabyrke/repos?sort=updated&per_page=100');
    
    if (!res.ok) {
        throw new Error('Failed to fetch repositories');
    }
    
    const repos = await res.json();
    const publicRepos = repos.filter(r => !r.private && !r.fork);
    
    if (publicRepos.length === 0) {
        container.innerHTML = '<p>No public repositories found.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    for (const repo of publicRepos) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const name = document.createElement('div');
        name.className = 'project-name';
        name.textContent = repo.name;
        
        const desc = document.createElement('p');
        desc.className = 'project-description';
        desc.textContent = repo.description || 'No description available';
        
        const footer = document.createElement('div');
        footer.className = 'project-footer';
        
        const langs = document.createElement('div');
        
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
        
        const link = document.createElement('a');
        link.className = 'project-link';
        link.href = repo.html_url;
        link.target = '_blank';
        link.textContent = 'View →';
        
        footer.appendChild(langs);
        footer.appendChild(link);
        
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(footer);
        container.appendChild(card);
    }
    } catch (err) {
    container.innerHTML = `<p>Error loading repositories: ${err.message}</p>`;
    }
}

fetchGitHubRepos();