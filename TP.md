
# **TP : Déploiement d'Applications Microservices**

## **1. Contexte du Projet**

L'objectif de ce projet est de simuler le cycle de vie complet d'une application moderne, de sa conception en microservices à son déploiement en production, en passant par l'automatisation.  

Les étudiants devront non seulement développer une application fonctionnelle mais aussi construire toute l'infrastructure sous-jacente pour la faire fonctionner de manière résiliente, scalable et automatisée.

Ce projet a pour but de vous placer dans la peau d'une équipe DevOps, où vous êtes responsables à la fois du code (`Dev`) et de l'infrastructure (`Ops`). La présentation finale sera orientée pour valoriser ces compétences techniques auprès d'un recruteur.

## **2. Objectifs Pédagogiques**

À la fin de ce projet, vous serez capable de :

- Comprendre et appliquer les principes de la conteneurisation et des microservices.
- Créer, exécuter et gérer des conteneurs avec Docker.
- Écrire des fichiers `Dockerfile` optimisés pour définir des environnements reproductibles.
- Configurer Docker Compose pour orchestrer une application multi-conteneurs en environnement de développement.
- Déployer, orchestrer et mettre à l'échelle des applications sur un cluster Kubernetes.
- Définir les objets Kubernetes essentiels (Pods, Déploiements, Services, Volumes, etc.).
- Appliquer des stratégies d'orchestration avancées (mises à jour sans interruption, auto-réparation).
- Intégrer un pipeline CI/CD pour automatiser les déploiements conteneurisés en production.

## **3. Idées de Projets (Choix libres mais voici quelques suggestions)**

Voici 3 **idées de projets** data engineer simples :

1. **ETL simple avec Python et SQLite:**
    - **Objectif:** Développer une application complète. Un **frontend** (interface utilisateur simple) permettra d'interagir avec un **backend** (API Python) qui extraira des données depuis une API publique, les transformera (nettoyage simple, sélection de colonnes), et les chargera dans une base de données SQLite locale pour la persistance des données.
    - **Technologies:** Python (avec `sqlite3`, et un framework web léger comme FastAPI pour le backend), au choix pour le frontend.
    - **Étapes:**
        1. Créer une base de données SQLite et une table pour stocker les données.
        2. Développer une API Python (backend) pour :
            - Extraire des données d'une API externe.
            - Transformer ces données.
            - Insérer les données transformées dans la base de données SQLite.
            - Exposer des endpoints pour que le frontend puisse récupérer les données stockées.
        3. Développer un frontend simple qui :
            - Appelle l'API Python pour déclencher l'extraction et le chargement des données.
            - Affiche les données persistées dans la base de données via l'API Python.
    - **Intérêt:** Comprendre le flux ETL de base, manipulation de données, interaction avec une base de données, et intégration d'un frontend/backend simple pour une application complète.

2. **Analyse de logs web avec Docker et ELK (Elasticsearch, Logstash, Kibana):**
    - **Objectif:** Mettre en place une stack ELK avec Docker Compose pour collecter, analyser et visualiser des logs d'un serveur web simple (Nginx).
    - **Technologies:** Docker, Docker Compose, ELK (Elasticsearch, Logstash, Kibana), Nginx.
    - **Étapes:**
        1. Créer un `docker-compose.yml` pour démarrer ELK et Nginx.
        2. Configurer Logstash pour qu'il lise les logs de Nginx.
        3. Générer du trafic sur le serveur Nginx.
        4. Créer un dashboard simple dans Kibana pour visualiser les requêtes (ex: par code de statut, par IP).
    - **Intérêt:** Découvrir un outil standard de l'industrie (ELK), gestion de logs, orchestration avec Docker Compose.

3. **Pipeline de données "temps-réel" avec Kafka et Python:**
    - **Objectif:** Simuler un flux de données (ex: des transactions financières) avec un producteur Python qui envoie des messages dans un topic Kafka. Un consommateur Python lit ces messages et les affiche ou les stocke dans un fichier.
    - **Technologies:** Docker, Docker Compose, Kafka, Python.
    - **Étapes:**
        1. Démarrer Kafka avec Docker Compose.
        2. Créer un script Python "producteur" qui génère des données factices et les envoie à un topic Kafka.
        3. Créer un script Python "consommateur" qui s'abonne au topic et traite les messages reçus.
    - **Intérêt:** Introduction au streaming de données, architecture producteur/consommateur, utilisation de Kafka.

## **4. Livrables Attendus**

1. **Dépôt Git :**
    - Hébergé sur GitHub, GitLab ou une plateforme similaire.
    - Structure de branches : `main` (protégée, représente la production) et `develop` (branche de travail principale). Les fonctionnalités sont développées sur des branches `feature/` puis mergées dans `develop`.
    - Un historique de commits clair et professionnel.

2. **Application Conteneurisée :**
    - Un `Dockerfile` par microservice, optimisé pour la taille et la sécurité (multi-stage builds).
    - Un fichier `.dockerignore` bien configuré pour exclure les fichiers inutiles du contexte de build.
    - Un fichier `.gitignore` pour eviter la fuite de variables sensibles.

3. **Environnement de Développement :**
    - Un fichier `docker-compose.yml` permettant de lancer l'ensemble de l'application et ses dépendances (bases de données, etc.) en une seule commande (`docker-compose up`).

4. **Environnement de Production (Kubernetes) :**
    - Un dossier `deploy/` contenant tous les manifestes Kubernetes (`.yaml`).
    - **Déploiements :** Un `Deployment` par microservice.
    - **Services :** Un `Service` (ClusterIP, NodePort ou LoadBalancer) pour exposer chaque déploiement.
    - **Gestion de la configuration :** Utilisation de `ConfigMap` pour les configurations non sensibles.
    - **Gestion des secrets :** Utilisation de `Secret` pour les mots de passe de base de données, clés d'API, etc. **Aucun secret ne doit être présent en clair dans le Git, ni dans l'image Docker**.
    - **Persistance des données :** Un `PersistentVolumeClaim` et `PersistentVolume` pour la base de données.

5. **Pipeline CI/CD :**
    - Un fichier de configuration de pipeline (ex: `.gitlab-ci.yml`, `.github/workflows/` pour GitHub Actions).
    - Le pipeline doit s'exécuter sur chaque push sur `develop` (pour les tests) et sur la création d'un **tag Git** sur `main` pour déclencher le déploiement en production.
    - **Étapes du pipeline :** Build des images Docker -> Push des images vers un registre (Docker Hub, GHCR, etc.) -> Déploiement sur Kubernetes (`kubectl apply`).

## **5. Critères d'Évaluation**

- **Qualité du code et de l'architecture** : L'application est fonctionnelle et suit les principes des microservices.
- **Conteneurisation** : Les Dockerfiles sont optimisés, le `docker-compose` est fonctionnel et bien structuré.
- **Orchestration** : Les manifestes Kubernetes sont corrects, l'application se déploie sans erreur, et les concepts (Services, Deployments, Secrets) sont bien utilisés.
- **CI/CD** : Le pipeline est automatisé, fonctionnel et déclenché par les tags.
- **Présentation et Documentation** : Le `README.md` est clair, et la présentation orale explique l'architecture, les choix techniques et les défis rencontrés.

## **Présentation Finale (15-20 minutes)**

**Note importante :** La présentation finale est une opportunité de démontrer votre compréhension des concepts abordés et votre démarche. Elle a aussi pour but de ne pas énaliser ceux qui n'auraient pas pu finaliser l'intégralité du projet, mais plutôt de valoriser votre apprentissage et votre capacité à expliquer vos choix techniques et les défis rencontrés.

La présentation doit être synthétique et percutante, comme si vous présentiez votre projet à un recruteur technique :

- **Slide 1 :** Titre, équipe, et pitch du projet (Qu'est-ce que ça fait ?).
- **Slide 2 :** Diagramme d'architecture (montrant les microservices, la base de données, et comment ils communiquent).
- **Slide 3 :** Le Workflow de Développement et Déploiement (Git flow -> CI/CD -> Kubernetes).
- **Démo (5-7 min) :** (ou screenshots pour éviter l'effet démo).
  - Montrer l'application qui fonctionne.
  - Montrer le pipeline CI/CD en action (déclenché par un tag).
  - Montrer l'application qui tourne sur Kubernetes (`kubectl get pods,svc,deploy`).
  - Simuler une panne (ex: `kubectl delete pod ...`) et montrer que Kubernetes redémarre le pod automatiquement (démonstration de l'auto-réparation).
- **Slide 4 :** Défis rencontrés et solutions apportées.
- **Slide 5 :** Axes d'amélioration possibles (évoquer les points bonus : monitoring, etc).
- **Conclusion :** Ce que ce projet vous a appris.

## **Pour aller plus loin (Bonus)**

Voici des **exemples** de points supplémentaires que vous pouvez intégrer pour enrichir le projet et le rendre encore plus impressionnant dans un portfolio.  
Vous pouvez les présenter comme des **bonus** ou des pistes d'amélioration.

- **Sécurité Avancée :**
  - **Analyse de vulnérabilités :** Intégrer une étape dans le CI/CD pour scanner les images Docker à la recherche de vulnérabilités (avec des outils comme `Trivy` ou `Snyk`).

- **Observabilité (Monitoring & Logging) :**
  - **Logging :** Configurer les applications pour qu'elles écrivent leurs logs sur la sortie standard (`stdout`). Dans Kubernetes, déployer une pile de logging centralisée (par exemple, **Loki** avec Promtail) pour collecter et visualiser les logs de tous les services.
  - **Monitoring :** Exposer des métriques applicatives (par exemple, avec **Prometheus**) et créer un tableau de bord simple (avec **Grafana**) pour visualiser l'état de santé de l'application (CPU, RAM, nombre de requêtes/s).

- **Gestion de Projet :**
  - **UV :** Utiliser un outil comme UV pour la gestion des dépendances Python et l'orchestration des tâches de développement, offrant une alternative rapide et moderne à pip et virtualenv.

## **Important : Utilisation de l'Intelligence Artificielle**

L'utilisation des outils d'IA (comme GitHub Copilot, ChatGPT, etc.) est **autorisée** pour ce projet, avec les règles suivantes :

1. **Transparence** : Vous devez mentionner dans votre documentation quels outils d'IA vous avez utilisés et pour quelles parties du projet.

2. **Compréhension** : Vous devez comprendre le code généré par l'IA. Lors de la soutenance, vous devrez être capable d'expliquer chaque ligne de code, même si elle a été générée par une IA.

3. **Validation** : Tout code généré par l'IA doit être vérifié et testé par vos soins. L'IA peut faire des erreurs ou générer du code obsolète.

4. **Personnalisation** : Ne vous contentez pas de copier-coller le code de l'IA. Adaptez-le à vos besoins spécifiques et à votre architecture.

5. **Sécurité** : Ne partagez jamais d'informations sensibles (clés API, mots de passe, etc.) avec les outils d'IA.

L'IA doit être utilisée comme un outil d'assistance et d'apprentissage, pas comme une solution de remplacement à votre réflexion et à votre travail.
