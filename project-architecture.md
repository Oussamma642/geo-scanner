geoscanner/
│
├── data/                       # 🪨 Matière première (Protégé en lecture seule)
│   ├── raw/
│   │   └── Rock Data/          # Les 4212 images téléchargées depuis Kaggle
│   │       ├── train/          # Le manuel d'apprentissage
│   │       ├── valid/          # L'examen blanc (pendant l'entraînement)
│   │       └── test/           # L'examen final (jamais vu par le modèle)
│   └── processed/              # Images redimensionnées ou données intermédiaires
│
├── notebooks/                  # 🔬 Laboratoire d'expérimentation (Brouillons Jupyter)
│   ├── 01_exploration.ipynb    # Visualisation et comptage des 9 classes de roches
│   ├── 02_preprocessing.ipynb  # Tests de redimensionnement (224x224) et normalisation
│   ├── 03_training_resnet50.ipynb # Entraînement du modèle sur Google Colab (GPU)
│   └── 04_evaluation.ipynb     # Calcul de la précision finale et Matrice de Confusion
│
├── src/                        # ⚙️ Moteur industriel (Code Python propre et définitif)
│   ├── __init__.py             # Indique que le dossier est un package Python
│   ├── dataset.py              # Fonctions de chargement et de transformation des images
│   ├── model.py                # Définition de l'architecture (ResNet-50 + 9 neurones de sortie)
│   ├── train.py                # Script d'automatisation de l'entraînement
│   ├── evaluate.py             # Script de test automatisé
│   └── predict.py              # Fonction cruciale : prend une image -> renvoie la prédiction
│
├── models/                     # 🧠 Coffre-fort du modèle (Ignoré par Git)
│   └── resnet50_best.pth       # Les poids mathématiques sauvegardés après l'entraînement
│
├── api/                        # 🌐 Serveur Backend (FastAPI)
│   ├── app.py                  # Le point d'entrée qui réceptionne les requêtes HTTP
│   └── utils.py                # Fonctions d'aide (vérification du format de l'image, etc.)
│
├── frontend/                   # 💻 Interface Utilisateur (React)
│   ├── src/
│   │   └── App.jsx             # Le site web où l'utilisateur upload sa photo de roche
│   └── package.json            # Dépendances Node.js du frontend
│
├── reports/                    # 📊 Vitrine académique (Pour le professeur)
│   ├── figures/                # Courbes d'entraînement et Matrices de Confusion générées
│   └── rapport.pdf             # Le document final expliquant la démarche scientifique
│
├── requirements.txt            # 📦 Passeport du projet (Liste des dépendances Python)
├── .gitignore                  # 🚫 Fichiers à ne pas envoyer sur GitHub (ex: models/, data/)
└── README.md                   # 📖 La page d'accueil de ton projet GitHub