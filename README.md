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

## Géocodage et quotas

La recherche française utilise en priorité `geo.api.gouv.fr/communes` (API Découpage administratif). En l'absence de commune française ou en cas de panne, la recherche internationale Open-Meteo est utilisée. L'altitude d'une commune n'est pas inventée : si elle est inconnue, le modèle météo la fournit lors du chargement des conditions.

Le serveur partage un cache en mémoire borné à 500 URL : recherches pendant 24 heures, météo pendant 30 minutes, et réponses de quota 429 pendant une minute pour éviter les appels répétés. Les requêtes simultanées identiques sont regroupées. Le cache disparaît au redémarrage et n'est pas partagé entre instances. Il réduit la consommation sans garantir la disponibilité d'un quota Open-Meteo, notamment sur un hébergement à adresse IP partagée. Un besoin de disponibilité supérieure nécessitera de vérifier les conditions d'usage et une offre météo adaptée.

## Météo depuis le navigateur

Le 27 octobre 2026, le déploiement Render renvoyait HTTP 200 pour la recherche de Brassac et HTTP 429 pour sa météo. Le navigateur charge désormais les prévisions directement depuis l'API publique Open-Meteo, qui autorise CORS, sans clé. Les coordonnées du lieu sont donc transmises à ce fournisseur depuis la connexion du visiteur ; cela est indiqué dans l'interface. Le cache navigateur en mémoire reste de 30 minutes. Une erreur 429 ne déclenche ni nouvelle tentative automatique immédiate ni changement de serveur. L'API serveur météo est conservée, mais n'est plus utilisée par le tableau de bord. Une disponibilité garantie et un usage commercial nécessitent de vérifier l'offre et les conditions Open-Meteo adaptées.

Validation : réponse réelle HTTP 200 avec `Access-Control-Allow-Origin: *` pour Brassac et calcul de 14 fenêtres. Les scénarios quota, réseau et réponse incomplète sont testés avec injection de réponses ; cette vérification ne remplace pas un essai dans le navigateur du visiteur.

## Révision grêle et traçabilité

La pénalité grêle a été supprimée faute de justification vérifiée ; aucun bonus spécifique n'est ajouté. Un signal de grêle dans les 12 jours précédents reste visible. Chaque date dispose désormais d'un détail des contributions au score. Voir [l'état des sources et des limites](docs/SOURCES.md) : consultation d'un résumé scientifique, blogs encore bloqués par le réseau, absence de calibration prédictive. Cette révision ne constitue pas une validation scientifique du score.
