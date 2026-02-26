from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from image_processing.analyzer import analyze_images

app = FastAPI(
    title="ZeroCivicSense AI Service",
    description="AI-powered image analysis for civic infrastructure verification",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    ticket_id: str
    image_url: str
    proof_url: Optional[str] = None


class AnalyzeResponse(BaseModel):
    ticket_id: str
    ai_score: float
    tamper_flag: bool
    progress_estimate: float
    similarity_index: Optional[float] = None
    details: dict = {}


@app.get("/health")
def health():
    return {"status": "ok", "service": "ZeroCivicSense AI Service"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        result = await analyze_images(
            ticket_id=request.ticket_id,
            image_url=request.image_url,
            proof_url=request.proof_url,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
