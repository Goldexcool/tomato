"""
Tomato Disease Classifier - FastAPI Server
Handles image uploads and predictions
"""
import os
# Force TensorFlow to use Keras 2 instead of Keras 3
os.environ['TF_USE_LEGACY_KERAS'] = '1'

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Load model from SavedModel format (converted from original .h5)
print("Loading model...")
model = tf.keras.models.load_model(r"C:\Users\golde\tomatoenv\saved_model")
print("✅ Model loaded successfully!")
print(f"Model input shape: {model.input_shape}")
print(f"Model output shape: {model.output_shape}")

# FastAPI app
app = FastAPI(title="Tomato Disease Classifier API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Disease classes
DISEASE_CLASSES = [
    "Healthy",
    "Early Blight",
    "Late Blight",
    "Bacterial Spot",
    "Septoria Leaf Spot",
    "Target Spot",
    "Mosaic Virus",
    "Yellow Leaf Curl Virus",
    "Leaf Mold",
    "Spider Mites"
]

@app.get("/")
def root():
    return {
        "message": "🍅 Tomato Disease Classifier API is running",
        "endpoints": {
            "predict": "/api/analyze (POST)",
            "health": "/health (GET)"
        },
        "model_info": {
            "input_shape": str(model.input_shape),
            "output_shape": str(model.output_shape),
            "parameters": int(model.count_params())
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_params": int(model.count_params())
    }

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze uploaded tomato leaf image
    Returns disease prediction and confidence
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and preprocess image
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        img = img.convert('RGB')
        img = img.resize((128, 128))  # Match model input size
        
        # Convert to array and normalize
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
        # Make prediction
        prediction = model.predict(img_array, verbose=0)
        confidence = float(prediction[0][0]) * 100
        
        # Binary classification: > 0.5 = Diseased, <= 0.5 = Healthy
        is_diseased = confidence > 50
        label = "Diseased" if is_diseased else "Healthy"
        
        return {
            "label": label,
            "confidence": round(confidence, 2),
            "raw_prediction": float(prediction[0][0]),
            "is_diseased": is_diseased,
            "message": "Analysis complete",
            "model": "tomato_cnn_binary"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# For feature-based prediction (if needed)
class PredictionInput(BaseModel):
    features: list

@app.post("/predict")
def predict_features(data: PredictionInput):
    """
    Alternative endpoint for feature-based prediction
    """
    try:
        input_array = np.array([data.features])
        prediction = model.predict(input_array, verbose=0)
        return {
            "prediction": prediction.tolist(),
            "confidence": float(prediction[0][0]) * 100
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🍅 TOMATO DISEASE CLASSIFIER API")
    print("="*60)
    print("Server: http://localhost:8000")
    print("Docs: http://localhost:8000/docs")
    print("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
