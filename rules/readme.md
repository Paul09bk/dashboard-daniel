# Projet Dashboard

Les dashboards ou tableau de bords permettent d’avoir une vision claire et précise sur l’état d’un business, ou d’un service.
Très employés de nos jours, ils constituent l’un des meilleurs moyens d’afficher de la data... mais également l’un des meilleurs moyens de mettre en avant vos talents de développeur WEB.

## Contexte

L'entreprise P.E.IoT est une entreprise qui propose la vente de capteurs domotiques.<br/>
Dans l'optique d'un projet de refonte de leur nouvelle application métier P.E.IoT fait un appel d'offre pour réaliser le POC de leur produit.

Ce produit doit leur permettre de visualiser le parc de capteurs en  circulation, afficher des métriques, des statistiques etc...

Le jeu de données fournis est composé de 3 collections Measures / Sensors / Users

- **Users** : répertorie l'ensemble des foyers où chaque capteur est en place
- **Sensors** : l'ensemble des capteurs (il y a plusieurs types de capteurs)
- **Measures** : les mesures de chaque capteur

L'entreprise n'a pas d'attente particulière sur les feature à implémenter, libre cours de faire les ateliers d'idéations et la recherche utilisateur nécessaire afin de comprendre les besoins de votre client. 

--- 

[[_TOC_]]

## Objectifs

Vous devez réaliser, en binôme votre propre dashboard. La réalisation de celui-ci se divise en 2 parties : le front-end et le back-end.

### **1. Front-end**

Le front-end représente la partie visible par l’utilisateur.
Vous devez réaliser un minimum de 6 widgets différents en respectant les conditions suivantes :

- Utiliser React. Chaque widget doit être un composant réutilisable.
- Au moins un widget doit être un graphique. Vous pouvez utiliser la librairie du nom de [_Recharts_](https://recharts.org/en-US/) ou tout autre librairie de graphes disponible sur npm.
- Les données affichées doivent provenir de 2 sources :
    - Au moins une APIs distantes (Bibliothèque allociné, spotify, Riot games ...), le plus simple est d'incorporer un widget de metéo, et d'utiliser l'API de openweather que l'on connait déjà ou OMDBapi pour incorporer une donnée liée à du contenu multimédia.
    - Une API que vous aurez réalisée (C.F. partie 2)
    
Votre projet comporte au minimum 2 pages distinctes : 
- une avec vos widgets 
- une autre permettant de manipuler votre base de données => une page **admin**

#### ***Aller plus loin***
Chaque widget devra être utilisable et testable dans l’environnement
[_Storybook_](https://storybook.js.org/docs/react/get-started/introduction) initialisé dans le repo du projet.
> _Exemple :_ [Story Book de Palmetto](https://5ed9214b642dc10022b50a2d-eckjqsexrb.chromatic.com/?path=/story/about-introduction--page)

### **2. Back-end**

Le back-end de ce projet expose une API REST qui permet d’accéder aux données mises en base de donnée, nécessaires au bon fonctionnement de vos widgets. Elle fera également le pont potentiellement pour faire des calls API à une autre API (histoire de ne pas avoir de token d'accès côté front).

Les contraintes sont les suivantes :

- L’API devra être réalisée à l’aide du framework __expressjs__.
- Elle devra implémenter les 4 opérations CRUD (Creation, Research, Update,
Delete des données) pour gerer les données de votre BDD.
- Vous devrez sauvegarder vos données dans une BDD utilisant MongoDB.
    - Un jeu de données est déjà exploitable. Les scripts à charger pour populler votre BDD se trouve [ici](./resources/)

## Organisation fonctionnel

Déterminez au préalable avec votre binôme les différentes tâches à effectuer pour ce projet et utiliser un outil tel que _Trello_, _Airtable_, _Notion_... pour suivre votre avancement.<br/>
Vous devez réfléchir à un découpage en petites tâches de votre projet, assigner les tâches aux bonnes personnes et leurs donner une date de fin.
Vous mettrez le **lien public** de l’outil que vous avez sélectionné dans le Readme de votre repo, afin que je puisse y accéder.

Effectuez un Mock-up de votre site sur un outil tel que _Figma_ (au hasard !). Celui-ci vous permettra de réfléchir à la fois à l'expérience utilisateur (UX) et à l’interface utilisateur (UI).
L’ensemble des images extraites de votre mockup doivent figurer dans le repo, ou bien exposer le lien figma en **public**

## Structuration du projet

Je vous propose une structure de projet que vous pouvez bien entendu revoir à votre guise.

```shell
├── readme.md
├── rules
├── server
└── web
```
Dans deux terminaux différents:
- lancer le server
    1. `cd server`
    1. `npm install`
    1. `npm run start`
- lancer le front 
    1. `cd web` 
    1. `npm install`
    1. `npm run dev`

## Nommage & utilisation de git

Il vous faudra forker le projet un seul fois par équipe (un seul membre fork le projet) puis chacun `clone` le repository.

Le repo devra prendre cette forme de nommage :<br/>
**`prj-create-tw-2024-01-<nom_1>-<nom_2>`**

Enfin vous travaillerez en _**`feature branch`**_ à vous de vous documentez sur la chose.

## Documentation

La Documentation n'est pas quelque chose de négligeable dans un projet tech, c'est d'ailleurs un produit dans le produit si l'on veut faire quelque chose de complet.

Aujourd'hui, l'exercice n'étant seulement "une reponse" à un appel d'offre, je ne vous demande pas de me faire une documentation complète. Cependant, un certain minimum est attendu: 
- la documentation se fera essentiellement via le [readme.md](../readme.md) à la racine du projet. A vous de vous renseigner sur comment rédiger du _Mardown_
- un **Getting Started** sera le bienvenu. => comment récupérer puis lancer votre projet. Mentionner les versions des différents frameworks / platforms utilisés dans l'optique de pouvoir reprendre le projet sans débugger plein d'erreur est un bon reflexe à prendre. Partez du principe que la personne qui récupère le projet à un ordinateur vierge, que doit-il installer pour que votre projet se lance. 
- Libre à vous de segmenter votre documentation dans un dossier _./documentation_ par exemple. Le point d'entrée étant toujours le [readme.md](../readme.md) à la racine qui peu faire office de "sommaire". A ce moment, des liens vers votre documentation est requis, apréciés.

## Notation

La note sera composée en deux partie. 
- Une première qui notera uniquement le projet. Je pars du principe que vous êtes des entreprises capables de repondre à mon besoin et que vous me fournissez un maquette / POC qui permet de repondre à mon appel d'offre. En fonction de ce que vous me présenterez, ergonomie, fonctionnalité implémenté, features innovantes (**soyez créatif**), code bien versionné, documentation qualitative... la note restera à 20 ou descendra petit à petit.
- Une deuxième partie sera _les points bonnus_ qui proviennent des TPs (ceux après le TP3). La notation de ces derniers se fera en classe début décembre.

---

En bref...
- Utiliser des outils de planification/gestion
- Créer un wireframe de votre site
- Créer 6 widgets dont minimum un graphe et un faisant appel aux données de votre API
- Utiliser Storybook pour tester vos widgets
- Le dashboard doit être responsive (PC, tablette, mobile)
- Créer une API et une BDD MongoDB
- L’aspect visuel de votre site sera également évalué

Sources d’inspirations :

https://www.uplabs.com/search?q=dashboard <br/>
https://dribbble.com/search?q=dashboard <br/>

__Bon courage à tous !!__

N'hésitez pas à être innovant et **soyez astucieux** dans le choix de la complexité de vos composants. Le sujet est volontairement large et peu cadré pour laisser libre cours à votre imagination en terme de fonctionnalités.

_Technos utilisées_ dans ce projet que vous pourrez mettre en avant dans un CV : React, Storybook, Node JS, Express, BDD noSQL, fullstackJS