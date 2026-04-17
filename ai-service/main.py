from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from chains.jargon_chain import translate_jargon
import uvicorn

app = FastAPI(title="SyncBridge AI Service", version="1.0.0")

class TranslationRequest(BaseModel):
    term: str
    role: str

class TranslationResponse(BaseModel):
    term: str
    role: str
    easyDefinition: str
    businessImpact: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    try:
        result = translate_jargon(request.term, request.role)
        return {
            "term": request.term,
            "role": request.role,
            "easyDefinition": result["easyDefinition"],
            "businessImpact": result["businessImpact"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
