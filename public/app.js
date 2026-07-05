// Helper to get service icons
window.getServiceIcon = function(service) {
    if (service === 'Google') return '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.2 14.22c-1.18.78-2.65 1.18-4.2 1.18-2.3 0-4.3-1.07-5.6-2.73l1.8-1.5c.9 1.1 2.2 1.8 3.8 1.8 1.1 0 2.1-.3 2.8-.8l1.4 2.05zM12 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4.6 3.6l-1.8-1.5c.3-.4.4-.8.4-1.3 0-1.8-1.5-3.3-3.3-3.3S8.6 10 8.6 11.8c0 .5.1.9.3 1.3l-1.8 1.5C6.4 13.5 6 12.7 6 11.8c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8c0 .9-.4 1.7-1 2.8z"/></svg>';
    if (service === 'OpenAI') return '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829v-2.3324a.0804.0804 0 0 1 .0332-.0615l4.854-2.8055a4.4992 4.4992 0 0 1 6.1408 1.6464 4.4708 4.4708 0 0 1 .5346 3.0137l-.142-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0v6.7511zM8.3065 12.863l-2.02-1.1686a.071.071 0 0 1-.038-.052V6.0598a4.504 4.504 0 0 1 4.4945-4.4944 4.4755 4.4755 0 0 1 2.8764 1.0408l-.1419.0804-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813v6.7369zm7.1979-3.487l-2.0201 1.1685V6.6573a.7664.7664 0 0 0-.3879-.6765L7.282 2.6265l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7865A4.504 4.504 0 0 1 15.5044 11.2v-1.824zm-3.5044-1.3828l-2.6105-1.5034 2.6105-1.5035 2.6105 1.5035-2.6105 1.5034z"/></svg>';
    if (service === 'Anthropic') return '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.3 17.5h-1.8l-1-2.5H9.6l-1 2.5H6.8L11.5 5h1.1l4.7 12.5zm-5-10.7l-2 5.3h4l-2-5.3z"/></svg>';
    if (service === 'Microsoft') return '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>';
    if (service === 'AWS') return '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14.54 13.91c-.81.42-2.1.84-3.49.84-2.22 0-3.32-1.15-3.32-2.73 0-1.86 1.4-2.88 3.88-2.88 1.19 0 2.05.23 2.76.51V9.22c0-1.63-.88-2.58-2.56-2.58-1.21 0-2.28.37-3.14.86L8 5.7c1.16-.72 2.84-1.19 4.61-1.19 3.03 0 4.66 1.51 4.66 4.3v5.68c0 .88.23 1.35.58 1.84v1.86a3.8 3.8 0 0 1-3.31-4.28zM14.54 11.1c-.56-.23-1.28-.42-2.07-.42-1.37 0-2.03.49-2.03 1.28 0 .72.58 1.19 1.54 1.19.98 0 1.93-.37 2.56-.84v-1.21z"/><path fill="currentColor" d="M16.51 18.06c-1.33.61-3.26.98-5.33.98-2.86 0-5.35-1.07-7.24-2.89L5.32 17.5c2.3 2.14 5.28 3.33 8.57 3.33 2.47 0 4.8-.54 6.84-1.54l-4.22-1.23z"/></svg>';
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
        
        // Clear existing googtrans cookies
        const host = window.location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + host + '; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.' + host + '; path=/;';

        if (targetLang === 'ko') {
            // Set translation to Korean without specifying domain to avoid CORS/Public Suffix List issues
            document.cookie = 'googtrans=/en/ko; path=/';
        } else {
            // Set translation back to English
            document.cookie = 'googtrans=/ko/en; path=/';
            document.cookie = 'googtrans=/en/en; path=/';
        }
        
        // Reload to apply translation
        window.location.reload();
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
