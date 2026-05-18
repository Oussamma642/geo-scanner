# pfm/api/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms, models
from PIL import Image
import io, torch.nn as nn

from knowledge_base import GEOLOGY_KNOWLEDGE
from explainer import generate_gradcam_base64 # Import de l'outil adapté

app = Flask(__name__)
CORS(app) # Permet au frontend React de communiquer

CLASSES = [
    'Basalt', 'Clay', 'Conglomerate', 'Diatomite', 
    'Shale-(Mudstone)', 'Siliceous-sinter', 'chert', 
    'gypsum', 'olivine-basalt'
]

# ──────────────────────────────────────────────────────────────────────────────
# ❌ ANCIENNE ARCHITECTURE (ResNet50) — COMMENTÉE
# ──────────────────────────────────────────────────────────────────────────────
# model = models.resnet50()
# model.fc = nn.Sequential(
#     nn.Dropout(0.5),
#     nn.Linear(2048, 9)
# )
# model.load_state_dict(
#     torch.load(r'D:\licence-dexellence\s6\m2-dl\pfm\models\resnet50_best_augmented.pth', map_location='cpu')
# )
# ──────────────────────────────────────────────────────────────────────────────

# ──────────────────────────────────────────────────────────────────────────────
# ✅ NOUVELLE ARCHITECTURE (ConvNeXt-Base) — ACTIVE
# ──────────────────────────────────────────────────────────────────────────────
# 1. On charge l'architecture de base ConvNeXt
model = models.convnext_tiny()

# 2. On reconstruit EXACTEMENT la tête custom utilisée lors de ton entraînement Phase A/B
in_features = model.classifier[2].in_features  # Récupère l'in_features natif (1024 pour Base)

model.classifier = nn.Sequential(
    nn.Flatten(1),
    nn.LayerNorm(in_features, eps=1e-6),   # Stabilise les activations
    nn.Dropout(p=0.4),                      # Premier Dropout (Régularisation)
    nn.Linear(in_features, 512),
    nn.GELU(),                              # Activation native de ConvNeXt
    nn.Dropout(p=0.3),                      # Deuxième Dropout
    nn.Linear(512, len(CLASSES)),           # Sortie vers tes 9 classes géologiques
)

# 3. Injection de tes nouveaux poids optimisés à 75% d'accuracy
model.load_state_dict(
    torch.load(r'D:\licence-dexellence\s6\m2-dl\pfm\models\convnext_best.pth', map_location='cpu')
)
# ──────────────────────────────────────────────────────────────────────────────

model.eval()  # Mode inférence — Désactive les couches Dropout

# Transform mathématique pour l'IA (Compatible avec ConvNeXt)
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# Transform visuel (Même géométrie, mais sans altérer les couleurs)
visual_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224)
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Aucun fichier image trouvé'}), 400
        
    file = request.files['image']
    img_raw = Image.open(io.BytesIO(file.read())).convert('RGB')
    
    # Préparation des deux versions de l'image
    tensor = transform(img_raw).unsqueeze(0)
    img_visual = visual_transform(img_raw)

    # Prédiction
    with torch.no_grad():
        outputs = torch.softmax(model(tensor), dim=1)[0]

    # Création du dictionnaire des scores triés par classe
    scores = {CLASSES[i]: round(float(outputs[i]) * 100, 2) for i in range(len(CLASSES))}
    top = max(scores, key=scores.get)
    top_index = CLASSES.index(top) # On récupère l'index pour Grad-CAM

    # Récupération de la fiche pédagogique depuis knowledge_base.py
    fiche_pedagogique = GEOLOGY_KNOWLEDGE.get(top, {
        "famille": "Non classifié",
        "description": "Information non disponible.",
        "criteres_visuels": "N/A"
    })

    # Génération de l'image explicable Grad-CAM via l'explainer mis à jour
    gradcam_b64 = generate_gradcam_base64(model, tensor, img_visual, top_index)

    return jsonify({
        'prediction': top,
        'confidence': scores[top],
        'details': scores,
        'pedagogy': fiche_pedagogique,
        'gradcam_image': f"data:image/jpeg;base64,{gradcam_b64}" # Renvoi au format base64
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)