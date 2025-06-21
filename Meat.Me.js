// Function to dynamically load CSS
function loadCSS(cssFile) {
    const existingLink = document.querySelector(`link[href="${cssFile}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile;
        link.dataset.dynamic = "true"; // Mark as dynamically loaded
        document.head.appendChild(link);
    }
}

// Function to dynamically unload all dynamically loaded CSS
function unloadDynamicCSS() {
    const dynamicLinks = document.querySelectorAll('link[data-dynamic="true"]');
    dynamicLinks.forEach(link => link.remove());
}

// Function to dynamically load JavaScript
function loadJS(jsFile) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${jsFile}"]`);
        if (existingScript) {
            resolve(); // Script already loaded
            return;
        }

        const script = document.createElement('script');
        script.src = jsFile;
        script.dataset.dynamic = "true"; // Mark as dynamically loaded
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${jsFile}`));
        
        document.body.appendChild(script);
    });
}

// Function to dynamically unload all dynamically loaded JavaScript
function unloadDynamicJS() {
    const dynamicScripts = document.querySelectorAll('script[data-dynamic="true"]');
    dynamicScripts.forEach(script => script.remove());
}

// Function to fetch and load content dynamically
async function showPage(pageUrl, containerId, cssFile = null, jsFile = null) {
    try {
        // Unload previous resources
        unloadDynamicCSS();
        if (pageUrl !== 'products.html') {
            unloadDynamicJS();
        }

        // Fetch and load new content
        const response = await fetch(pageUrl);
        if (!response.ok) {
            throw new Error(`Failed to load ${pageUrl}`);
        }
        
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;

        // Update visibility
        const sections = document.querySelectorAll('main > div');
        sections.forEach(section => {
            section.style.display = section.id === containerId ? 'block' : 'none';
        });

        // Load CSS if specified
        if (cssFile) {
            loadCSS(cssFile);
        }

        // Load and initialize JS if specified
        if (jsFile) {
            await loadJS(jsFile);
            
            if (pageUrl === 'products.html') {
                // Initialize products page functionality
                if (typeof initializeSwiper === 'function') {
                    initializeSwiper();
                }
                if (typeof initializeProductFunctionality === 'function') {
                    initializeProductFunctionality();
                }
            }
        }
    } catch (error) {
        console.error('Error loading page:', error);
    }
}

// Page configuration
const pageConfig = {
    home: { url: 'home.html', containerId: 'home-content', css: 'home.css', js: null },
    products: { url: 'products.html', containerId: 'product-list', css: 'products.css', js: 'products.js' },
    about: { url: 'about-us.html', containerId: 'aboutus-content', css: 'about-us.css', js: null },
    contact: { url: 'contact.html', containerId: 'contact-content', css: 'contact.css', js: null },
    FAQ: { url: 'FAQ.html', containerId: 'FAQ-content', css: 'FAQ.css', js: null }
};

// Add event listeners to navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('data-page');
            const config = pageConfig[page];
            if (config) {
                showPage(config.url, config.containerId, config.css, config.js);
            }
        });
    });

    // Load home page by default
    showPage('home.html', 'home-content', 'home.css', null);
});
