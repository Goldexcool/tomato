# 🍅 Tomato Disease Classifier - COMPLETE SETUP

## ✅ What's Working

Your tomato disease classification model has been successfully converted and integrated!

### Model Status:
- ✅ Original H5 model loaded
- ✅ Weights extracted and saved  
- ✅ Converted to TensorFlow SavedModel format
- ✅ Ready to use with Python backend

## 🚀 How to Run

### Option 1: With Python Backend (Real AI Predictions) ⭐ RECOMMENDED

1. **Start the Python API Server** (Terminal 1):
   ```powershell
   cd C:\Users\golde\tomatoenv
   python api_server.py
   ```
   Server will run on: http://localhost:5000

2. **Start the Next.js App** (Terminal 2):
   ```powershell
   cd C:\Users\golde\tomatoenv
   npm run dev
   ```
   App will run on: http://localhost:3001

3. **Upload images** and get REAL AI predictions! 🎉

### Option 2: Mock Data Only (No Python Server)

If you only run the Next.js app without the Python server, it will automatically fall back to mock predictions.

## 📁 Project Structure

```
C:\Users\golde\tomatoenv\
├── saved_model\              # Your converted TensorFlow model
├── api_server.py              # Python Flask API server
├── tomato_leaf_cnn_model.h5   # Original model file
├── app\
│   ├── api\analyze\route.ts   # Next.js API (forwards to Python)
│   └── page.tsx               # Frontend UI
├── public\models\             # For TensorFlow.js (if needed later)
└── package.json
```

## 🔧 Technical Details

### Your Model:
- **Architecture**: Sequential CNN
- **Input**: 128x128x3 RGB images
- **Output**: Binary classification (Healthy vs Diseased)
- **Parameters**: 3,304,769
- **Layers**:
  - 3x Conv2D (32, 64, 128 filters)
  - 3x MaxPooling2D
  - Flatten + Dropout
  - 2x Dense (128, 1)

### API Endpoints:

**Python Backend:**
- `POST http://localhost:5000/api/analyze` - Analyze tomato leaf image
- `GET http://localhost:5000/health` - Check server status

**Next.js API:**
- `POST http://localhost:3001/api/analyze` - Forwards to Python backend with fallback

## 🐛 Troubleshooting

### Python server won't start?
```powershell
# Install dependencies
pip install flask flask-cors pillow tensorflow
```

### Port already in use?
- Change port in `api_server.py` (line 71): `port=5000` → `port=5001`
- Update `PYTHON_API_URL` in Next.js API route

### Model not found?
- Check path in `api_server.py` line 13
- Ensure `saved_model\` directory exists

## 🎯 Next Steps

1. ✅ **Test with real images** - Upload tomato leaf photos
2. 📊 **Add more disease classes** - Update `DISEASE_CLASSES` in `api_server.py`
3. 📧 **Implement postal card export** - Generate PDF reports
4. 🎨 **Enhance UI** - Add treatment recommendations
5. 🚀 **Deploy** - Host Python API and Next.js app

## 📝 Notes

- The model was trained for binary classification (Healthy/Diseased)
- You may want to retrain for multi-class classification (10 disease types)
- Current confidence score represents "disease probability"
- Images are automatically resized to 128x128 pixels

---

**Need help?** Check the conversion logs in:
- `convert_with_patch.py` - Model inspection
- `rebuild_and_convert.py` - Architecture rebuild
- `final_convert.py` - SavedModel conversion
