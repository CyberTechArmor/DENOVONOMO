/**
 * Chart.js wrapper component for De Novo NoMo.
 * Provides helper functions to create and update Chart.js charts
 * with consistent styling derived from CSS custom properties.
 */

/**
 * Read a CSS variable from the document root.
 *
 * @param {string} varName - CSS variable name (e.g., '--color-primary')
 * @param {string} fallback - Fallback value if variable is not defined
 * @returns {string}
 */
function getCSSVar(varName, fallback) {
  var style = getComputedStyle(document.documentElement);
  var value = style.getPropertyValue(varName).trim();
  return value || fallback;
}

/**
 * Build the default color palette from CSS variables.
 *
 * @returns {string[]}
 */
function getDefaultColors() {
  return [
    getCSSVar('--color-primary', '#4f46e5'),
    getCSSVar('--color-success', '#10b981'),
    getCSSVar('--color-warning', '#f59e0b'),
    getCSSVar('--color-danger', '#ef4444'),
    getCSSVar('--color-info', '#3b82f6'),
    getCSSVar('--color-secondary', '#6b7280'),
    getCSSVar('--color-accent', '#8b5cf6'),
    getCSSVar('--color-accent-alt', '#ec4899'),
  ];
}

/**
 * Default tooltip configuration.
 */
function getDefaultTooltip() {
  return {
    backgroundColor: getCSSVar('--color-surface', '#1f2937'),
    titleColor: getCSSVar('--color-text', '#f9fafb'),
    bodyColor: getCSSVar('--color-text-secondary', '#d1d5db'),
    borderColor: getCSSVar('--color-border', '#374151'),
    borderWidth: 1,
    padding: 10,
    cornerRadius: 6,
    displayColors: true,
    boxPadding: 4,
  };
}

/**
 * Default grid configuration.
 */
function getDefaultGrid() {
  return {
    color: getCSSVar('--color-border', 'rgba(255,255,255,0.06)'),
    drawBorder: false,
    tickLength: 0,
  };
}

/**
 * Merge user options onto a base config object (shallow per top-level key).
 */
function mergeOptions(base, user) {
  if (!user) return base;
  var merged = {};
  var key;
  for (key in base) {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      merged[key] = base[key];
    }
  }
  for (key in user) {
    if (Object.prototype.hasOwnProperty.call(user, key)) {
      if (typeof merged[key] === 'object' && typeof user[key] === 'object' && !Array.isArray(merged[key])) {
        merged[key] = Object.assign({}, merged[key], user[key]);
      } else {
        merged[key] = user[key];
      }
    }
  }
  return merged;
}

/**
 * Build a common chart configuration for a given type.
 *
 * @param {string} type - Chart type: 'line', 'bar', 'doughnut', 'horizontalBar'
 * @param {object} data - Chart.js data object (labels, datasets)
 * @param {object} [options] - Additional Chart.js options
 * @returns {object} Full Chart.js config
 */
function buildConfig(type, data, options) {
  var colors = getDefaultColors();

  // Auto-assign colors to datasets if not already set
  if (data && data.datasets) {
    data.datasets.forEach(function (ds, i) {
      var color = colors[i % colors.length];
      if (!ds.backgroundColor) {
        if (type === 'line') {
          ds.backgroundColor = color + '1a'; // 10% opacity
          ds.borderColor = ds.borderColor || color;
          ds.borderWidth = ds.borderWidth || 2;
          ds.pointBackgroundColor = ds.pointBackgroundColor || color;
          ds.pointRadius = ds.pointRadius || 3;
          ds.tension = ds.tension !== undefined ? ds.tension : 0.3;
          ds.fill = ds.fill !== undefined ? ds.fill : true;
        } else if (type === 'doughnut' || type === 'pie') {
          ds.backgroundColor = colors.slice(0, (ds.data || []).length);
          ds.borderWidth = ds.borderWidth || 0;
        } else {
          ds.backgroundColor = color + 'cc'; // 80% opacity
          ds.borderColor = ds.borderColor || color;
          ds.borderWidth = ds.borderWidth || 0;
          ds.borderRadius = ds.borderRadius || 4;
        }
      }
    });
  }

  var isCartesian = type !== 'doughnut' && type !== 'pie';
  var actualType = type === 'horizontalBar' ? 'bar' : type;

  var defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: getDefaultTooltip(),
      legend: {
        labels: {
          color: getCSSVar('--color-text-secondary', '#9ca3af'),
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
    },
  };

  if (isCartesian) {
    var grid = getDefaultGrid();
    defaultOptions.scales = {
      x: {
        grid: grid,
        ticks: { color: getCSSVar('--color-text-secondary', '#9ca3af') },
      },
      y: {
        grid: grid,
        ticks: { color: getCSSVar('--color-text-secondary', '#9ca3af') },
        beginAtZero: true,
      },
    };

    if (type === 'horizontalBar') {
      defaultOptions.indexAxis = 'y';
    }
  }

  var finalOptions = mergeOptions(defaultOptions, options || {});

  return {
    type: actualType,
    data: data,
    options: finalOptions,
  };
}

/**
 * Create a Chart.js chart with De Novo NoMo default styling.
 *
 * @param {string} canvasId - The DOM id of the <canvas> element
 * @param {string} type - 'line', 'bar', 'doughnut', 'horizontalBar'
 * @param {object} data - Chart.js data object
 * @param {object} [options] - Additional Chart.js options to merge
 * @returns {Chart} The Chart.js instance
 */
function initChart(canvasId, type, data, options) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error('Chart canvas not found: #' + canvasId);
  }

  var ctx = canvas.getContext('2d');
  var config = buildConfig(type, data, options);

  // Chart is globally available from the Chart.js CDN
  if (typeof Chart === 'undefined') {
    throw new Error('Chart.js is not loaded. Include it via CDN before using initChart.');
  }

  return new Chart(ctx, config);
}

/**
 * Update an existing chart with new data and re-render.
 *
 * @param {Chart} chart - The Chart.js instance
 * @param {object} data - New data object ({ labels, datasets })
 */
function updateChart(chart, data) {
  if (!chart) return;

  if (data.labels) {
    chart.data.labels = data.labels;
  }

  if (data.datasets) {
    data.datasets.forEach(function (newDs, i) {
      if (chart.data.datasets[i]) {
        Object.assign(chart.data.datasets[i], newDs);
      } else {
        chart.data.datasets.push(newDs);
      }
    });

    // Remove extra datasets if the new data has fewer
    if (data.datasets.length < chart.data.datasets.length) {
      chart.data.datasets.length = data.datasets.length;
    }
  }

  chart.update();
}

// Export for CommonJS / make globally available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initChart, updateChart, buildConfig, getCSSVar };
}
window.ChartHelper = { initChart: initChart, updateChart: updateChart, buildConfig: buildConfig };
