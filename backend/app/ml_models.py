import numpy as np
from typing import List, Dict, Any
import random
from datetime import datetime, timedelta

class AnomalyDetector:
    def __init__(self):
        self.threshold = 0.7
        self.history = []
        
    def predict(self, cpu: float, memory: float, error_rate: float) -> float:
        """Predict anomaly score"""
        # Simple weighted scoring
        cpu_score = max(0, (cpu - 70) / 30)  # Normalize
        memory_score = max(0, (memory - 75) / 25)
        error_score = min(1.0, error_rate * 10)
        
        weights = [0.4, 0.4, 0.2]
        score = (cpu_score * weights[0] + 
                memory_score * weights[1] + 
                error_score * weights[2])
        
        return min(1.0, score)
    
    def detect_anomaly(self, metric: Dict[str, Any]) -> bool:
        """Detect if metric is anomalous"""
        if 'cpu_usage' in metric and 'memory_usage' in metric:
            score = self.predict(
                metric['cpu_usage'],
                metric['memory_usage'],
                metric.get('error_rate', 0)
            )
            return score > self.threshold
        return False

class CostPredictor:
    def __init__(self):
        pass
    
    def forecast(self, days: int) -> List[Dict[str, Any]]:
        """Forecast future costs"""
        forecast = []
        base_cost = 1000  # Base monthly cost
        
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            # Add some seasonality and trend
            trend = i * 5  # Increasing trend
            seasonality = 50 * np.sin(i / 7 * 2 * np.pi)  # Weekly seasonality
            noise = random.uniform(-20, 20)
            
            daily_cost = base_cost / 30 + trend / 30 + seasonality + noise
            
            forecast.append({
                "date": date.strftime("%Y-%m-%d"),
                "predicted_cost": max(0, daily_cost),
                "lower_bound": max(0, daily_cost - 15),
                "upper_bound": daily_cost + 15
            })
        
        return forecast
