# 🛍️ DevShop

Vitrine de boutique en ligne de type **Single Page Application (SPA)**. L'application récupère une liste de produits depuis une API publique, les affiche dynamiquement, permet de les filtrer et gère un panier d'achat interactif — le tout sur une seule page.

Projet réalisé dans le cadre du module JavaScript de la formation **Akieni Academy** (S10).

---

## ✨ Fonctionnalités

### Niveau 1 — Les fondamentaux
- Connexion à l'API via `fetch()` et `async/await`
- Affichage dynamique des cartes produits (image, titre, prix, catégorie) directement injectées dans le DOM
- Gestion des états UX : indicateur de chargement ("Loader") pendant l'appel réseau, message d'erreur clair en cas d'échec (`try/catch`)
- Interface entièrement responsive : CSS Grid pour la grille de produits, Flexbox pour la navigation et le panier

### Niveau 2 — L'interactivité
- Filtrage par catégorie (boutons générés dynamiquement, `Array.filter()`)
- Barre de recherche en temps réel (événement `input` + `String.includes()`)
- Ajout au panier avec mise à jour du compteur dans la barre de navigation

### Niveau 3 — Le bonus
- Tiroir panier off-canvas : résumé des articles, modification des quantités, suppression
- Persistance des données du panier via `localStorage` (le panier survit au rafraîchissement de la page)

---

## 🛠️ Stack technique

- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript ES6+ (vanilla, sans framework)
- [FakeStore API](https://fakestoreapi.com/) — gratuite, sans clé d'authentification requise

---

## 🚀 Lancer le projet

Aucune installation n'est nécessaire, aucune clé API à configurer.

1. Cloner le repo ou télécharger le dossier `devshop/`
2. Ouvrir `index.html` dans un navigateur

Ou avec un serveur local :

```bash
cd devshop
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

---

## 🗂️ Structure

```
devshop/
├── index.html
├── style.css
└── script.js
```

---

## 🎨 Charte graphique

Interface inspirée de l'identité visuelle de **Perkier** : fond crème, palette corail/jaune/vert menthe, typographie ronde et amicale, coins très arrondis, boutons en forme de pilule. Ambiance chaleureuse et énergique.

---

## 👤 Auteur

Précieux Mavoungou Bayonne — Fullstack developer trainee, Akieni Academy (Promotion Juin 2026)
