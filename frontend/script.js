const API_BASE_URL = 'http://localhost:8000';
let metricsChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    refreshAll();
    setInterval(refreshAll, 30000); // Refresh every 30 seconds
});

// Refresh all data
async function refreshAll() {
    await updateDashboardStats();
    await updateAlerts();
    await updateMetrics();
    await updateCostOptimizations();
    await updateDeployments();
    await updateMLModels();
    updateHealthMetrics();
}

// Update dashboard statistics
async function updateDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const data = await response.json();
        
        document.getElementById('activeAlerts').textContent = data.active_alerts;
        document.getElementById('costSavings').textContent = `$${data.cost_savings.toFixed(2)}`;
        document.getElementById('totalPods').textContent = '9';
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Update alerts
async function updateAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts?resolved=false&limit=10`);
        const alerts = await response.json();
        
        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '';
        
        alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert-item ${alert.severity}`;
            
            const time = new Date(alert.timestamp).toLocaleTimeString();
            
            alertElement.innerHTML = `
                <div class="alert-header">
                    <div class="alert-title">${alert.message}</div>
                    <div class="alert-time">${time}</div>
                </div>
                <div class="alert-desc">
                    ${alert.pod_name ? `Pod: ${alert.pod_name}` : ''}
                    ${alert.namespace ? ` | Namespace: ${alert.namespace}` : ''}
                </div>
                <div class="alert-actions">
                    <button class="btn-resolve" onclick="resolveAlert(${alert.id})">
                        <i class="fas fa-check"></i> Resolve
                    </button>
                    ${alert.pod_name ? `
                    <button class="btn-autoheal" onclick="autoHealPod('${alert.pod_name}', '${alert.namespace}')">
                        <i class="fas fa-magic"></i> Auto-Heal
                    </button>` : ''}
                </div>
            `;
            
            alertsList.appendChild(alertElement);
        });
    } catch (error) {
        console.error('Error updating alerts:', error);
    }
}

// Update metrics and chart
async function updateMetrics() {
    try {
        const response = await fetch(`${API_BASE_URL}/metrics/current`);
        const metrics = await response.json();
        
        // Update health metrics
        const avgCpu = metrics.reduce((sum, m) => sum + m.cpu_usage, 0) / metrics.length;
        const avgMemory = metrics.reduce((sum, m) => sum + m.memory_usage, 0) / metrics.length;
        const avgError = metrics.reduce((sum, m) => sum + m.error_rate, 0) / metrics.length;
        
        document.getElementById('avgCpu').textContent = `${avgCpu.toFixed(1)}%`;
        document.getElementById('avgMemory').textContent = `${avgMemory.toFixed(1)}%`;
        document.getElementById('avgError').textContent = `${avgError.toFixed(2)}%`;
        
        document.getElementById('cpuBar').style.width = `${avgCpu}%`;
        document.getElementById('memoryBar').style.width = `${avgMemory}%`;
        document.getElementById('errorBar').style.width = `${Math.min(100, avgError * 5)}%`;
        
        // Update chart
        updateChart();
    } catch (error) {
        console.error('Error updating metrics:', error);
    }
}

// Update cost optimizations
async function updateCostOptimizations() {
    try {
        const response = await fetch(`${API_BASE_URL}/cost/optimization`);
        const optimizations = await response.json();
        
        const costList = document.getElementById('costOptimizations');
        costList.innerHTML = '';
        
        optimizations.forEach(opt => {
            const costElement = document.createElement('div');
            costElement.className = 'cost-item';
            
            costElement.innerHTML = `
                <div class="cost-header">
                    <div class="cost-title">${opt.resource_name} (${opt.resource_type})</div>
                    <div class="cost-amount">Save: $${opt.monthly_savings.toFixed(2)}/month</div>
                </div>
                <div class="cost-desc">${opt.recommended_action}</div>
                <div class="cost-actions">
                    <button class="btn-apply">
                        <i class="fas fa-check"></i> Apply
                    </button>
                    <button class="btn-resolve">
                        <i class="fas fa-times"></i> Ignore
                    </button>
                </div>
            `;
            
            costList.appendChild(costElement);
        });
    } catch (error) {
        console.error('Error updating cost optimizations:', error);
    }
}

// Update deployments
async function updateDeployments() {
    try {
        const response = await fetch(`${API_BASE_URL}/deployments`);
        const deployments = await response.json();
        
        const deploymentsList = document.getElementById('deploymentsList');
        deploymentsList.innerHTML = '';
        
        deployments.forEach(deploy => {
            const deployElement = document.createElement('div');
            deployElement.className = 'deployment-item';
            
            const time = new Date(deploy.timestamp).toLocaleTimeString();
            const statusClass = deploy.status === 'success' ? 'success' : 
                              deploy.status === 'failed' ? 'failed' : 'deploying';
            
            deployElement.innerHTML = `
                <div class="deployment-header">
                    <div class="deployment-title">${deploy.image}</div>
                    <div class="deployment-time">${time}</div>
                </div>
                <div class="deployment-desc">
                    Version: ${deploy.version} | Replicas: ${deploy.replicas}
                    <span class="status-badge ${statusClass}">${deploy.status}</span>
                </div>
            `;
            
            deploymentsList.appendChild(deployElement);
        });
    } catch (error) {
        console.error('Error updating deployments:', error);
    }
}

// Update ML models
async function updateMLModels() {
    try {
        const response = await fetch(`${API_BASE_URL}/ml/models`);
        const models = await response.json();
        
        const mlModels = document.getElementById('mlModels');
        mlModels.innerHTML = '';
        
        models.forEach(model => {
            const modelElement = document.createElement('div');
            modelElement.className = 'model-item';
            
            const time = new Date(model.timestamp).toLocaleDateString();
            
            modelElement.innerHTML = `
                <div class="deployment-header">
                    <div class="deployment-title">${model.name}</div>
                    <div class="deployment-time">${time}</div>
                </div>
                <div class="deployment-desc">
                    Version: ${model.version}
                    <span class="status-badge ${model.status}">${model.status}</span>
                </div>
                ${model.accuracy ? `<div>Accuracy: ${(model.accuracy * 100).toFixed(2)}%</div>` : ''}
                ${model.latency ? `<div>Latency: ${model.latency.toFixed(2)}ms</div>` : ''}
            `;
            
            mlModels.appendChild(modelElement);
        });
    } catch (error) {
        console.error('Error updating ML models:', error);
    }
}

// Update chart
async function updateChart() {
    const metricType = document.getElementById('metricSelector').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/metrics/historical?hours=24`);
        const metrics = await response.json();
        
        const ctx = document.getElementById('metricsChart').getContext('2d');
        
        if (metricsChart) {
            metricsChart.destroy();
        }
        
        const labels = metrics.map(m => new Date(m.timestamp).toLocaleTimeString()).reverse();
        const data = metrics.map(m => {
            switch(metricType) {
                case 'cpu': return m.cpu_usage;
                case 'memory': return m.memory_usage;
                case 'errors': return m.error_rate;
                default: return m.cpu_usage;
            }
        }).reverse();
        
        metricsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.filter((_, i) => i % 12 === 0), // Show every hour
                datasets: [{
                    label: metricType === 'cpu' ? 'CPU Usage %' : 
                           metricType === 'memory' ? 'Memory Usage %' : 'Error Rate %',
                    data: data.filter((_, i) => i % 12 === 0),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: metricType !== 'errors',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// Resolve alert
async function resolveAlert(alertId) {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
            method: 'POST'
        });
        
        if (response.ok) {
            updateAlerts();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error resolving alert:', error);
    }
}

// Auto-heal pod
async function autoHealPod(podName, namespace) {
    try {
        const response = await fetch(`${API_BASE_URL}/incidents/autoheal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pod_name: podName,
                namespace: namespace
            })
        });
        
        if (response.ok) {
            alert(`Auto-healing triggered for pod ${podName}`);
            updateAlerts();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error triggering auto-healing:', error);
    }
}

// Trigger auto-healing for all
async function triggerAutoHealing() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts?resolved=false`);
        const alerts = await response.json();
        
        for (const alert of alerts) {
            if (alert.pod_name) {
                await autoHealPod(alert.pod_name, alert.namespace);
            }
        }
        
        alert('Auto-healing triggered for all applicable pods');
    } catch (error) {
        console.error('Error triggering auto-healing:', error);
    }
}

// Deploy application
async function submitDeployment(event) {
    event.preventDefault();
    
    const image = document.getElementById('image').value;
    const version = document.getElementById('version').value;
    const replicas = parseInt(document.getElementById('replicas').value);
    const namespace = document.getElementById('namespace').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/deploy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image,
                version,
                replicas,
                namespace
            })
        });
        
        if (response.ok) {
            alert('Deployment started!');
            closeDeployModal();
            updateDeployments();
        }
    } catch (error) {
        console.error('Error deploying:', error);
        alert('Deployment failed!');
    }
}

// Modal functions
function showDeployModal() {
    document.getElementById('deployModal').style.display = 'flex';
}

function closeDeployModal() {
    document.getElementById('deployModal').style.display = 'none';
}

// Utility functions
function showSettings() {
    alert('Settings would open here');
}

function exportData() {
    alert('Data export would start here');
}

function updateHealthMetrics() {
    // Simulate real-time updates
    setTimeout(updateMetrics, 5000);
}
