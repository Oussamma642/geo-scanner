# pfm/api/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms, models
from PIL import Image
import io, torch.nn as nn

from knowledge_base import GEOLOGY_KNOWLEDGE
from explainer import generate_gradcam_base64 # 🌟 Import du nouvel outil

app = Flask(__name__)
CORS(app)

CLASSES = [
    'Basalt', 'Clay', 'Conglomerate', 'Diatomite', 
    'Shale-(Mudstone)', 'Siliceous-sinter', 'chert', 
    'gypsum', 'olivine-basalt'
]

model = models.resnet50()
model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(2048, 9)
)

model.load_state_dict(
    # torch.load('models/resnet50_best_augmented.pth', map_location='cpu')
    torch.load(r'D:\licence-dexellence\s6\m2-dl\pfm\models\resnet50_best_augmented.pth', map_location='cpu')
)
model.eval()

# Transform mathématique pour l'IA
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# 🌟 Transform visuel (Même géométrie, mais sans altérer les couleurs)
visual_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224)
])

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    img_raw = Image.open(io.BytesIO(file.read())).convert('RGB')
    
    # Préparation des deux versions de l'image
    tensor = transform(img_raw).unsqueeze(0)
    img_visual = visual_transform(img_raw)

    # Prédiction
    with torch.no_grad():
        outputs = torch.softmax(model(tensor), dim=1)[0]

    scores = {CLASSES[i]: round(float(outputs[i]) * 100, 2) for i in range(9)}
    top = max(scores, key=scores.get)
    top_index = CLASSES.index(top) # On récupère l'index (0 à 8) pour Grad-CAM

    # Récupération de la fiche pédagogique
    fiche_pedagogique = GEOLOGY_KNOWLEDGE.get(top, {
        "famille": "Non classifié",
        "description": "Information non disponible.",
        "criteres_visuels": "N/A"
    })

    # 🌟 Génération de l'image explicable Grad-CAM
    gradcam_b64 = generate_gradcam_base64(model, tensor, img_visual, top_index)

    return jsonify({
        'prediction': top,
        'confidence': scores[top],
        'details': scores,
        'pedagogy': fiche_pedagogique,
        'gradcam_image': f"data:image/jpeg;base64,{gradcam_b64}" # Prêt à être affiché en HTML/React !
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)