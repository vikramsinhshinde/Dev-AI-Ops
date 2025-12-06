import random
from datetime import datetime
from typing import List, Dict, Any

class CostOptimizer:
    def __init__(self):
        self.resources = [
            {"type": "EC2", "name": "web-server-1", "instance_type": "t3.large"},
            {"type": "EC2", "name": "database-1", "instance_type": "r5.xlarge"},
            {"type": "RDS", "name": "prod-db", "instance_class": "db.r5.large"},
            {"type": "S3", "name": "data-bucket", "storage_class": "STANDARD"},
            {"type": "EKS", "name": "k8s-cluster", "node_type": "m5.large"},
            {"type": "Lambda", "name": "data-processor", "memory": "1024MB"}
        ]
    
    def get_recommendations(self) -> List[Dict[str, Any]]:
        """Get cost optimization recommendations"""
        recommendations = []
        
        for i, resource in enumerate(self.resources):
            current_cost = random.uniform(100, 500)
            potential_savings = random.uniform(20, 200)
            
            if resource["type"] == "EC2":
                action = "Switch to Spot instances" if random.random() > 0.5 else "Right-size to smaller instance"
            elif resource["type"] == "RDS":
                action = "Enable auto-scaling" if random.random() > 0.5 else "Reserve instance"
            elif resource["type"] == "S3":
                action = "Move to Intelligent Tiering"
            elif resource["type"] == "EKS":
                action = "Enable cluster autoscaler"
            else:
                action = "Optimize memory configuration"
            
            recommendations.append({
                "id": i + 1,
                "resource_type": resource["type"],
                "resource_name": resource["name"],
                "current_cost": round(current_cost, 2),
                "recommended_action": action,
                "potential_savings": round(potential_savings, 2),
                "monthly_savings": round(potential_savings * 30, 2),
                "confidence": round(random.uniform(0.7, 0.95), 2),
                "timestamp": datetime.now()
            })
        
        return recommendations
