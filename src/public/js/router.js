class Router {
  constructor() {
    this.routes = [];
    this.currentPage = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  add(pattern, handler) {
    // pattern like '/documents/:id' becomes regex
    const paramNames = [];
    const regex = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    }) + '$');
    this.routes.push({ pattern, regex, paramNames, handler });
    return this;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/dashboard';
    for (const route of this.routes) {
      const match = hash.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => params[name] = match[i + 1]);
        if (this.currentPage && this.currentPage.destroy) {
          this.currentPage.destroy();
        }
        this.currentPage = route.handler(params);
        this.updateActiveNav(hash);
        this.updateBreadcrumbs(hash);
        return;
      }
    }
    // 404
    document.getElementById('page-content').innerHTML = '<div class="p-8"><h1>Page Not Found</h1></div>';
  }

  navigate(path) {
    window.location.hash = path;
  }

  updateActiveNav(hash) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === hash || hash.startsWith(item.dataset.route + '/'));
    });
  }

  updateBreadcrumbs(hash) {
    const breadcrumb = document.getElementById('breadcrumbs');
    if (!breadcrumb) return;
    const parts = hash.split('/').filter(Boolean);
    let html = '<a href="#/dashboard" class="breadcrumb-item">Home</a>';
    let path = '';
    parts.forEach((part, i) => {
      path += '/' + part;
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
      if (i === parts.length - 1) {
        html += ` <span class="breadcrumb-sep">/</span> <span class="breadcrumb-item active">${label}</span>`;
      } else {
        html += ` <span class="breadcrumb-sep">/</span> <a href="#${path}" class="breadcrumb-item">${label}</a>`;
      }
    });
    breadcrumb.innerHTML = html;
  }
}

export default Router;
