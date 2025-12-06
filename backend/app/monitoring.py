import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

class MonitoringService:
    def __init__(self):
        self.pods = [
            "web-app-1", "web-app-2", "api-service-1", 
            "api-service-2", "database-primary", "cache-service",
            "ml-inference", "message-queue", "monitoring-agent"
        ]
        
    def get_current_metrics(self) -> List[Dict[str, Any]]:
        """Get current metrics for all pods"""
        metrics = []
        
        for pod in self.pods:
            # Simulate realistic metrics
            cpu = random.uniform(10, 90)
            memory = random.uniform(20, 85)
            
            metrics.append({
                "pod_name": pod,
                "namespace": "production",
                "cpu_usage": round(cpu, 2),
                "memory_usage": round(memory, 2),
                "network_in": round(random.uniform(100, 1000), 2),
                "network_out": round(random.uniform(50, 500), 2),
                "request_count": random.randint(100, 5000),
                "error_rate": round(random.uniform(0, 5), 2),
                "timestamp": datetime.now().isoformat()
            })
        
        return metrics
    
    def get_historical_metrics(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get historical metrics"""
        history = []
        
        for i in range(hours * 12):  # Every 5 minutes
            timestamp = datetime.now() - timedelta(minutes=i*5)
            cpu = 50 + 20 * (i % 24) / 24  # Daily pattern
            
            history.append({
                "timestamp": timestamp.isoformat(),
                "cpu_usage": round(cpu + random.uniform(-10, 10), 2),
                "memory_usage": round(60 + random.uniform(-15, 15), 2),
                "request_count": random.randint(500, 3000),
                "error_rate": round(random.uniform(0, 3), 2)
            })
        
        return history
