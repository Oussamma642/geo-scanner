
# pfm/api/explainer.py

import cv2
import numpy as np
import base64
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

def generate_gradcam_base64(model, input_tensor, visual_image, target_class_index):
    # 1. Définir la couche cible (Pour ResNet50, c'est la dernière couche convolutive)
    target_layers = [model.layer4[-1]]
    
    # 2. Initialiser l'outil Grad-CAM
    cam = GradCAM(model=model, target_layers=target_layers)
    
    # 3. Définir la cible (On veut voir pourquoi il a prédit CETTE roche)
    targets = [ClassifierOutputTarget(target_class_index)]
    
    # 4. Générer le masque thermique (valeurs entre 0 et 1)
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0, :]
    
    # 5. Préparer l'image visuelle
    # L'image doit être au format Numpy, RGB, avec des pixels entre 0.0 et 1.0
    rgb_img = np.float32(visual_image) / 255.0
    
    # 6. Superposer la carte de chaleur sur l'image visuelle
    visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
    
    # 7. Convertir le résultat en Base64 pour l'envoi HTTP
    # OpenCV utilise BGR par défaut, on reconvertit
    vis_bgr = cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.jpg', vis_bgr)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return img_base64
