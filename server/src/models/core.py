from pydantic import BaseModel


class HealthCheck(BaseModel):
    """
    Model Pydantic simple utilitzat per representar la resposta
    de l'endpoint de health check.
    
    Aquest model s'utilitza per indicar el nom del servidor per mostar-ho
    als clients.
    """
    name: str # Un camp de cadena que normalment conté el nom del servei o aplicació.
