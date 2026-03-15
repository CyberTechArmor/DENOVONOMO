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
      const route = item.dataset.route || '';
      // hash is like "/dashboard", route is like "dashboard" (from data-route attr)
      const hashRoute = hash.replace(/^\//, '');
      const isActive = hashRoute === route || hashRoute.startsWith(route + '/');
      item.classList.toggle('is-active', isActive);
    });
  }

  updateBreadcrumbs(hash) {
    const el = document.getElementById('breadcrumb-current');
    if (!el) return;
    const parts = hash.split('/').filter(Boolean);
    // Show the last meaningful segment as the current breadcrumb
    const last = parts[parts.length - 1] || 'Dashboard';
    const label = last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
    el.textContent = label;
  }
}

export default Router;
