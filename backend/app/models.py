from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class Alert(BaseModel):
    id: int
    severity: str  # info, warning, critical
    message: str
    type: str  # anomaly, performance, security
    timestamp: datetime
    resolved: bool = False
    resolved_at: Optional[datetime] = None
    pod_name: Optional[str] = None
    namespace: Optional[str] = None

class CostOptimization(BaseModel):
    id: int
    resource_type: str
    resource_name: str
    current_cost: float
    recommended_action: str
    potential_savings: float
    monthly_savings: float
    confidence: float
    timestamp: datetime

class Deployment(BaseModel):
    id: int
    image: str
    version: str
    replicas: int
    namespace: str
    status: str  # deploying, success, failed
    timestamp: datetime
    duration: Optional[float] = None

class MLModel(BaseModel):
    id: int
    name: str
    version: str
    status: str  # deploying, active, failed
    timestamp: datetime
    accuracy: Optional[float] = None
    latency: Optional[float] = None

class Incident(BaseModel):
    id: int
    title: str
    description: str
    status: str  # open, investigating, resolved
    timestamp: datetime
    resolved_at: Optional[datetime] = None
    auto_healed: bool = False
    resolution: Optional[str] = None
