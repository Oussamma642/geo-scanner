
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms, models
from PIL import Image
import io, torch.nn as nn

app = Flask(__name__)
CORS(app) # Permet au frontend React de communiquer

# Dans ton fichier app.py

CLASSES = [
    'Basalt',             # Index 0
    'Clay',               # Index 1
    'Conglomerate',       # Index 2
    'Diatomite',          # Index 3
    'Shale-(Mudstone)',   # Index 4
    'Siliceous-sinter',   # Index 5
    'chert',              # Index 6
    'gypsum',             # Index 7
    'olivine-basalt'      # Index 8
]

# Charger l'architecture vide
model = models.resnet50()
model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(2048, 9)
)

# Injecter les poids appris = charger le .pth
model.load_state_dict(
    torch.load('models/resnet50_best_augmented.pth', map_location='cpu')
# D:\licence-dexellence\s6\m2-dl\pfm\models\resnet50_best_augmented.pth
)

model.eval()  # Mode inférence — désactive le Dropout

# L'image brute ne peut pas aller directement dans ResNet
# Elle doit être transformée exactement comme pendant l'entraînement

transform = transforms.Compose([
    transforms.Resize(256),        # Redimensionner
    transforms.CenterCrop(224),    # Rogner au centre → 224×224
    transforms.ToTensor(),         # Convertir en tenseur [3, 224, 224]
    transforms.Normalize(          # Normaliser avec stats ImageNet
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    img = Image.open(io.BytesIO(file.read())).convert('RGB')
    tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        outputs = torch.softmax(model(tensor), dim=1)[0]

    scores = {
        CLASSES[i]: round(float(outputs[i]) * 100, 2)
        for i in range(9)
    }

    top = max(scores, key=scores.get)

    return jsonify({
        'prediction': top,
        'confidence': scores[top],
        'details': scores
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)