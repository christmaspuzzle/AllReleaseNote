window.getServiceIcon = function(service) {
    const logoMap = {
        'Google': 'images/google.png',
        'Anthropic': 'images/anthropic.png',
        'OpenAI': 'images/openai.png',
        'Microsoft': 'images/microsoft.png',
        'Amazon Web Services': 'images/amazon.png',
        'AWS': 'images/amazon.png'
    };
    
    if (logoMap[service]) {
        // Reduce padding for OpenAI and Amazon to make them visually larger within the same 24px circle
        let padding = '3px';
        if (service === 'OpenAI' || service === 'Amazon Web Services' || service === 'AWS') {
            padding = '0px';
        }
        return `<img src="${logoMap[service]}" style="width: 24px; height: 24px; border-radius: 50%; background: #fff; object-fit: contain; padding: ${padding}; box-sizing: border-box;" alt="${service} icon">`;
    }
    
    return '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
};

window.toggleDescription = function(btn) {
    const p = btn.closest('.timeline-content').querySelector('.release-description');
    if (p.classList.contains('clamped')) {
        p.classList.remove('clamped');
        btn.innerHTML = 'Show less <span class="chevron" style="transform: rotate(180deg)">˅</span>';
    } else {
        p.classList.add('clamped');
        btn.innerHTML = 'Show more <span class="chevron">˅</span>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    const grid = document.getElementById('releases-grid');
    const loading = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const searchInput = document.getElementById('search-input');
    const tabsContainer = document.getElementById('tabs-container');
    const subTabsContainer = document.getElementById('sub-tabs-container');
    const refreshBtn = document.getElementById('refresh-btn');
    const langSelect = document.getElementById('language-select');
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpBtn = document.getElementById('close-help-btn');

    // Help Modal Logic
    if(helpBtn) {
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'flex';
        });
    }
    if(closeHelpBtn) {
        closeHelpBtn.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });
    }
    if(helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
            }
        });
    }

    // Language Toggle Logic (Google Translate)
    const isKorean = document.cookie.includes('googtrans=/en/ko');
    if (isKorean) {
        langSelect.value = 'ko';
    }

    langSelect.addEventListener('change', (e) => {
        const targetLang = e.target.value; // 'en' or 'ko'
        
        // Find the native Google Translate combo box
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = targetLang;
            // Create a native HTML event that is guaranteed to bubble and be caught by Google's scripts
            if (document.createEvent) {
                const event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, true);
                combo.dispatchEvent(event);
            } else {
                combo.fireEvent('onchange'); // Fallback for ancient browsers
            }
        } else {
            // If combo isn't loaded yet, retry in 500ms
            setTimeout(() => langSelect.dispatchEvent(new Event('change')), 500);
        }
    });

    let allReleases = [];
    const initialHierarchy = {
        'AWS': ['Amazon QuickSight'],
        'Anthropic': ['Claude', 'Claude Code', 'Claude Developer Platform'],
        'Google': ['Antigravity', 'Gemini API', 'Gemini CLI', 'Gemini Enterprise Agent Platform', 'Vertex AI'],
        'Microsoft': ['Microsoft Copilot', 'Agent Framework'],
        'OpenAI': ['ChatGPT', 'ChatGPT Enterprise/EDU', 'Codex', 'OpenAI Models']
    };
    let servicesMap = new Map(); // Map<serviceName, Set<subServiceName>>
    for (const [company, products] of Object.entries(initialHierarchy)) {
        servicesMap.set(company, new Set(products));
    }

    async function fetchReleases(forceRefresh = false) {
        try {
            loading.style.display = 'flex';
            errorEl.style.display = 'none';
            grid.innerHTML = '';
            
            const url = forceRefresh ? '/api/releases/refresh' : '/api/releases';
            const options = forceRefresh ? { method: 'POST' } : {};
            
            if (forceRefresh) {
                refreshBtn.textContent = 'Fetching...';
                refreshBtn.disabled = true;
            }

            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Failed to fetch releases');
            const items = await response.json();

            // Clear arrays and maps on refresh
            allReleases = [];
            servicesMap = new Map();
            for (const [company, products] of Object.entries(initialHierarchy)) {
                servicesMap.set(company, new Set(products));
            }

            items.forEach(item => {
                const title = item.title || '';
                let link = item.link || '#';
                if (link.startsWith('https://raw.githubusercontent.com/')) {
                    link = link.replace('https://raw.githubusercontent.com/', 'https://github.com/')
                               .replace('/refs/heads/', '/blob/');
                }
                const pubDate = item.pubDate || '';
                const descriptionRaw = item.description || '';
                
                // Parse description HTML to get clean text
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = descriptionRaw;
                // Get the second paragraph which usually contains the actual text (skipping the date para)
                const paragraphs = tempDiv.querySelectorAll('p');
                let cleanDescription = '';
                if(paragraphs.length > 1) {
                     cleanDescription = paragraphs[1].textContent;
                } else if(paragraphs.length === 1) {
                     cleanDescription = paragraphs[0].textContent;
                } else {
                     cleanDescription = tempDiv.textContent;
                }

                // Extract service from title (e.g., "Google: Gemini - ...")
                let service = 'Other';
                let subService = 'General';
                let cleanTitle = title;
                
                if (title.includes(':')) {
                    const parts = title.split(':');
                    service = parts[0].trim();
                    if (service === 'Amazon Web Services' || service === 'Amazon' || service === 'AWS') {
                        service = 'AWS';
                    }
                    let restOfTitle = parts.slice(1).join(':').trim();
                    
                    if(restOfTitle.includes(' - ')) {
                        const subParts = restOfTitle.split(' - ');
                        subService = subParts[0].trim();
                        
                        // Normalize known sub-services to prevent duplicates
                        const subLower = subService.toLowerCase();
                        if (subLower === 'amazon quicksight') subService = 'Amazon QuickSight';
                        else if (subLower === 'amazon sagemaker') subService = 'Amazon SageMaker';
                        else if (subLower === 'amazon bedrock') subService = 'Amazon Bedrock';
                        else if (subLower === 'amazon web services' || subLower === 'aws') subService = 'General';

                        let actualTitleToDisplay = subParts.slice(1).join(' - ').trim();
                        
                        // Check if the actual title is generic (only a date, version, or week)
                        const isGenericTitle = actualTitleToDisplay.match(/^(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})$/i) ||
                                               actualTitleToDisplay.match(/^Release v?[\d\.]+$/i) ||
                                               actualTitleToDisplay.match(/^[\d\.]+$/) ||
                                               actualTitleToDisplay.match(/^Week \d+$/i);
                                               
                        if (isGenericTitle) {
                            const verbs = ['adds', 'ships', 'releases', 'improves', 'updates', 'expands', 'raises', 'deprecates', 'launches', 'retires'];
                            const regex = new RegExp(`(?:${verbs.join('|')})\\s+([^,\\.]+?)(?:,|$|\\.)`, 'i');
                            const match = cleanDescription.match(regex);
                            
                            if (match) {
                                let feature = match[1].trim();
                                feature = feature.replace(/^(a|an|the|ga)\s+/i, ''); // Strip leading articles or GA
                                feature = feature.charAt(0).toUpperCase() + feature.slice(1);
                                
                                const verbMatch = cleanDescription.match(new RegExp(`(${verbs.join('|')})`, 'i'));
                                if (verbMatch) {
                                    const verb = verbMatch[1].toLowerCase();
                                    if (['adds', 'ships', 'releases', 'launches'].includes(verb)) {
                                        cleanTitle = `New ${feature}`;
                                    } else if (['improves', 'updates'].includes(verb)) {
                                        cleanTitle = `Improved ${feature}`;
                                    } else if (verb === 'expands') {
                                        cleanTitle = `Expanded ${feature}`;
                                    } else if (verb === 'raises') {
                                        cleanTitle = `Raised ${feature}`;
                                    } else if (['deprecates', 'retires'].includes(verb)) {
                                        cleanTitle = `Deprecated ${feature}`;
                                    } else {
                                        cleanTitle = feature;
                                    }
                                } else {
                                    cleanTitle = feature;
                                }
                            } else {
                                cleanTitle = actualTitleToDisplay || restOfTitle;
                            }
                        } else {
                            cleanTitle = actualTitleToDisplay || restOfTitle;
                        }
                    } else {
                        // Handle titles without hyphens automatically
                        // If it contains known product names, assign it, otherwise 'General'
                        if (service === 'Anthropic') {
                            if (restOfTitle.toLowerCase().includes('claude developer platform')) subService = 'Claude Developer Platform';
                            else if (restOfTitle.toLowerCase().includes('claude code')) subService = 'Claude Code';
                            else if (restOfTitle.toLowerCase().includes('claude')) subService = 'Claude';
                            else subService = 'General';
                        } else if (service === 'Google') {
                            if (restOfTitle.toLowerCase().includes('gemini enterprise agent platform')) subService = 'Gemini Enterprise Agent Platform';
                            else if (restOfTitle.toLowerCase().includes('gemini api')) subService = 'Gemini API';
                            else if (restOfTitle.toLowerCase().includes('gemini cli')) subService = 'Gemini CLI';
                            else if (restOfTitle.toLowerCase().includes('vertex ai')) subService = 'Vertex AI';
                            else if (restOfTitle.toLowerCase().includes('antigravity')) subService = 'Antigravity';
                            else if (restOfTitle.toLowerCase().includes('gemini')) subService = 'Gemini';
                            else subService = 'General';
                        } else if (service === 'OpenAI') {
                            if (restOfTitle.toLowerCase().includes('chatgpt enterprise/edu') || restOfTitle.toLowerCase().includes('chatgpt enterprise')) subService = 'ChatGPT Enterprise/EDU';
                            else if (restOfTitle.toLowerCase().includes('chatgpt')) subService = 'ChatGPT';
                            else if (restOfTitle.toLowerCase().includes('codex')) subService = 'Codex';
                            else if (restOfTitle.toLowerCase().includes('openai models')) subService = 'OpenAI Models';
                            else subService = 'General';
                        } else if (service === 'Microsoft') {
                            if (restOfTitle.toLowerCase().includes('copilot')) subService = 'Microsoft Copilot';
                            else subService = 'General';
                        } else {
                            subService = 'General';
                        }
                        cleanTitle = restOfTitle;
                    }
                }

                if (!servicesMap.has(service)) {
                    servicesMap.set(service, new Set());
                }
                servicesMap.get(service).add(subService);

                const date = new Date(pubDate);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                allReleases.push({
                    title: cleanTitle,
                    service,
                    subService,
                    link,
                    date: formattedDate,
                    timestamp: date.getTime(),
                    description: cleanDescription
                });
            });

            // Sort by date descending
            allReleases.sort((a, b) => b.timestamp - a.timestamp);

            populateTabs();
            renderReleases(allReleases);

            if (forceRefresh) {
                refreshBtn.textContent = 'Fetch Latest';
                refreshBtn.disabled = false;
            }

        } catch (err) {
            console.error(err);
            loading.style.display = 'none';
            errorEl.style.display = 'block';
            errorEl.textContent = 'Unable to load release notes. Please try again later.';
            
            if (forceRefresh) {
                refreshBtn.textContent = 'Fetch Latest';
                refreshBtn.disabled = false;
            }
        }
    }

    let currentService = 'all';
    let selectedSubServices = new Set();

    function populateTabs() {
        tabsContainer.innerHTML = '';
        
        // Add "All" tab
        const allTab = document.createElement('button');
        allTab.className = 'tab-button active';
        allTab.textContent = 'All Services';
        allTab.onclick = () => selectTab('all', allTab);
        tabsContainer.appendChild(allTab);

        const customOrder = ['Google', 'Anthropic', 'OpenAI', 'Amazon Web Services', 'Microsoft'];
        const allServices = Array.from(servicesMap.keys());
        
        allServices.sort((a, b) => {
            const indexA = customOrder.indexOf(a);
            const indexB = customOrder.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        allServices.forEach(service => {
            const tab = document.createElement('button');
            tab.className = 'tab-button';
            tab.textContent = service === 'Amazon Web Services' ? 'AWS' : service;
            tab.onclick = () => selectTab(service, tab);
            tabsContainer.appendChild(tab);
        });
    }

    function selectTab(service, tabElement) {
        currentService = service;
        selectedSubServices.clear(); // Reset sub-selections when main tab changes
        
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        tabElement.classList.add('active');
        
        populateSubTabs(service);
        filterReleases();
    }

    function populateSubTabs(service) {
        subTabsContainer.innerHTML = '';
        
        let subServices = [];
        if (service === 'all') {
            const allSubs = new Set();
            servicesMap.forEach(subs => {
                subs.forEach(s => {
                    if (s !== 'General') allSubs.add(s); // Optionally exclude 'General' from all list, or include it. Let's include it.
                });
            });
            // Re-build allSubs to include General if any service has it, but it's better to just show actual products
            servicesMap.forEach(subs => subs.forEach(s => allSubs.add(s)));
            subServices = Array.from(allSubs).sort();
        } else {
            subServices = Array.from(servicesMap.get(service)).sort();
        }

        if (subServices.length <= 1 && service !== 'all') {
            subTabsContainer.style.display = 'none';
            return; // Don't show if there's only 1 or 0 sub-categories for a specific service
        }

        if (subServices.length === 0) {
             subTabsContainer.style.display = 'none';
             return;
        }

        subTabsContainer.style.display = 'flex';
        subServices.forEach(sub => {
            const btn = document.createElement('button');
            btn.className = 'sub-tab-button';
            btn.textContent = sub;
            btn.onclick = () => toggleSubTab(sub, btn);
            subTabsContainer.appendChild(btn);
        });
    }

    function toggleSubTab(subService, btn) {
        if (selectedSubServices.has(subService)) {
            selectedSubServices.delete(subService);
            btn.classList.remove('active');
        } else {
            selectedSubServices.add(subService);
            btn.classList.add('active');
        }
        filterReleases();
    }

    function renderReleases(releases) {
        loading.style.display = 'none';
        grid.innerHTML = '';
        
        if (releases.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 2rem;">No releases found matching your criteria.</p>';
            return;
        }

        releases.forEach((release, index) => {
            const card = document.createElement('div');
            card.className = 'timeline-item';
            card.style.animationDelay = `${index * 0.05}s`;
            
            card.innerHTML = `
                <div class="timeline-date">${release.date}</div>
                <div class="timeline-content">
                    <div class="service-header">
                        <span class="service-icon">
                            ${getServiceIcon(release.service)}
                        </span>
                        <span class="service-tag">${release.subService !== 'General' ? release.subService + ' by ' + release.service : release.service}</span>
                    </div>
                    <h3 class="release-title">${release.title}</h3>
                    
                    <div class="description-wrapper">
                        <p class="release-description clamped">${release.description}</p>
                    </div>
                    
                    <div class="action-buttons" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                        <button class="show-more-btn" onclick="toggleDescription(this)">Show more <span class="chevron">˅</span></button>
                        <a href="${release.link}" target="_blank" rel="noopener noreferrer" class="original-source-btn" style="margin-left: auto;">Original source <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
            
            // Hide 'Show more' if text is short
            setTimeout(() => {
                const desc = card.querySelector('.release-description');
                const btn = card.querySelector('.show-more-btn');
                if (desc.scrollHeight <= desc.clientHeight) {
                    btn.style.display = 'none';
                    desc.classList.remove('clamped');
                }
            }, 0);
        });
        
        // Force Google Translate to process newly injected dynamic DOM nodes
        setTimeout(triggerReTranslation, 300);
    }
    
    function triggerReTranslation() {
        const isKorean = document.cookie.includes('googtrans=/en/ko');
        if (!isKorean) return;
        
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
            // Momentarily switch to English then back to Korean to force DOM re-scan
            combo.value = 'en';
            combo.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                combo.value = 'ko';
                combo.dispatchEvent(new Event('change'));
            }, 100);
        }
    }

    function filterReleases() {
        const searchTerm = searchInput.value.toLowerCase();

        const filtered = allReleases.filter(release => {
            const matchesSearch = release.title.toLowerCase().includes(searchTerm) || 
                                  release.description.toLowerCase().includes(searchTerm);
            const matchesService = currentService === 'all' || release.service === currentService;
            
            const matchesSubService = selectedSubServices.size === 0 || selectedSubServices.has(release.subService);
            
            return matchesSearch && matchesService && matchesSubService;
        });

        renderReleases(filtered);
    }

    searchInput.addEventListener('input', filterReleases);
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => fetchReleases(true));
    }

    // Initial fetch
    fetchReleases();

    // Auto-refresh every 1 hour (3,600,000 ms)
    setInterval(() => {
        console.log('Auto-refreshing releases...');
        fetchReleases();
    }, 60 * 60 * 1000);
});
