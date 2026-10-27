# Sous-bois

Prototype web de suivi des conditions favorables aux cèpes. Node.js 24+, sans dépendances externes.

- `npm start` : serveur sur le port 3000 (`PORT` personnalisable).
- `npm test` : tests de la fenêtre temporelle, du gel et des données manquantes.
- Les lieux sont stockés dans le navigateur, sans compte ni synchronisation.
- Open-Meteo : géocodage et prévisions à 16 jours, historique récent à 14 jours. Le serveur utilise le proxy réseau de l'environnement.

## État réel

Le calcul est une heuristique exploratoire **non validée**, et non une probabilité de poussée. Les seuils et pondérations sont provisoires et ne sont pas présentés comme issus d'études. L'altitude renvoyée par le géocodage est conservée et celle du modèle météo est affichée ; pas encore d'altitude saisissable ou de coordonnées manuelles.

Les e-mails et les notifications Web Push en arrière-plan ne sont pas encore implémentés. Leur livraison nécessitera stockage serveur, consentement, coordonnées des destinataires, désinscription, planification et déduplication, ainsi qu'un fournisseur e-mail et une configuration Web Push. Aucun message n'est envoyé par ce prototype.

## Validation scientifique à réaliser

L'accès réseau aux publications a échoué pendant la préparation. Aucune revue de littérature n'est revendiquée. Rechercher les études spécifiques à Boletus edulis et son groupe, distinguer observations corrélatives et validation prédictive, documenter DOI, espèces, région, échelle temporelle, variables et limites. Ne pas transférer automatiquement des résultats annuels ou multiespèces à une prévision locale de J+1 à J+14.

Collecter ensuite avec consentement des observations de présence ET d'absence, dates, habitat, essences, altitude et effort de prospection. Évaluer hors échantillon, par lieu et par année, la précision des alertes et leur calibration, comparées à une référence saisonnière simple. Une fenêtre à deux semaines doit porter une incertitude plus élevée. Les orages avec grêle du modèle météo sont un indicateur de risque, pas une mesure locale de grêle ; l'humidité de l'air ne mesure pas l'humidité du sol.

## Fenêtres courtes et historique

Les dates candidates vont de demain (J+1) à J+14. Pour chaque date, pluie, températures et refroidissements sont calculés sur les 12 jours précédents. La distinction entre jours passés et jours prévus est affichée. Les jours passés fournis par l’API ne sont pas présentés comme des mesures effectuées sur place. À J+1, la fenêtre comprend 11 jours passés et la journée actuelle ; à J+14 elle repose entièrement sur les prévisions. Les 14 jours passés téléchargés couvrent le besoin de 12 jours de recul.

Fournisseur retenu pour les futurs e-mails : **Resend**, via son API HTTPS. L’intégration et les envois ne sont pas encore actifs. Un domaine vérifié, une adresse d’expédition et une clé configurée dans les paramètres sécurisés seront nécessaires. Ne jamais placer de clé dans le navigateur ou dans Git.

## Alertes pendant l’utilisation

Le centre de veille vérifie tous les lieux à l’ouverture, toutes les 30 minutes lorsque la page est visible et au retour dans l’onglet (cache météo de 30 minutes). Le bouton Actualiser force une nouvelle lecture. Une erreur météo est affichée comme une vérification impossible, jamais comme une absence de conditions favorables.

Une fenêtre d’indice expérimental au moins égal à 60 déclenche une alerte dans l’interface. Ce seuil est provisoire. L’utilisateur peut activer ou désactiver les notifications du navigateur par un bouton dédié ; la permission n’est jamais demandée automatiquement. HTTPS et un navigateur compatible sont requis. Sur certains navigateurs mobiles, l’API Notification directe n’est pas disponible : l’interface conserve les alertes, mais un service worker sera nécessaire pour les notifications système.

Les notifications sont limitées à une par lieu et par jour dans ce navigateur, avec mémorisation locale pendant 30 jours. L’effacement ou l’indisponibilité du stockage peut supprimer cette protection ; plusieurs onglets ne sont pas synchronisés. La fermeture de l’application interrompt la veille. Aucun e-mail ni Web Push n’est envoyé.
