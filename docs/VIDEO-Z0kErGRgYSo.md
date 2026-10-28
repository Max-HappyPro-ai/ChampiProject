# Exploitation de la transcription vidéo Z0kErGRgYSo

Source : [vidéo fournie par l'utilisateur](https://www.youtube.com/watch?v=Z0kErGRgYSo), transcription DOCX reçue le 28 octobre 2026. Analyse du texte fourni, sans vérification des graphiques ni visionnage de la vidéo. Les horodatages viennent de cette transcription. La vidéo porte explicitement sur **Boletus edulis**, dans un contexte d'expérience de terrain en Belgique ; ce n'est pas une expérimentation contrôlée ni une règle applicable automatiquement à tous les cèpes.

## Informations exploitables

| Passage | Conseil ou observation du vidéaste | Conséquence pour l'outil |
|---|---|---|
| 3:18–3:45 | Saison locale souvent août–octobre, parfois juillet ou novembre. | Repère local souple ; pas de blocage calendaire pour toute la France. |
| 4:01–4:40 | Déclenchement associé à un changement conduisant le **sol** vers 10–15 °C, variable selon les régions. | Ne pas confondre température de l'air et température du sol ; la fourchette n'est pas appliquée à l'air comme seuil validé. |
| 5:26–6:04 | Trois situations : pluie et refroidissement, refroidissement sur sol déjà humide, redoux pluvieux après période froide. | Ajouter une chronologie des épisodes, dont le redoux ; ne plus se limiter à une chute isolée de température maximale. |
| 6:04–6:24 | Le changement ne doit pas s'annuler dans les 48–72 h ; délai ensuite annoncé de 10–15 jours selon température. | Vérifier un maintien météo modélisé sur trois jours, puis rechercher une fenêtre à 10–15 jours de l'épisode. Cela reste une hypothèse de terrain. |
| 6:24–6:45 | Apparitions étalées et durée de poussée. | Afficher une fenêtre, pas une heure ou un jour de récolte garanti. Ne pas déduire une comestibilité de l'âge annoncé. |
| 6:52–8:15 | Rôle du « stock mycélien », conditions pendant la préparation, poussées successives possibles ou absentes. | Le stock n'est pas observable par la météo ; aucune quantité de cèpes ni épuisement calculé à partir des seules pluies. Des absences ne prouvent pas à elles seules l'épuisement. |
| 8:36–9:04 | Pluie de 14,8 mm suivie d'une remontée rapide vers 30 °C : épisode jugé annulé. | Tester explicitement le retour rapide à la situation chaude. Ce récit ne fournit pas un seuil universel de pluie. |
| 9:23–10:48 | Pluies très localisées, sorties à environ 100 km du lieu habituel. | Signaler les limites d'une commune comme localisation ; coordonnées de la parcelle et observations locales restent préférables. |
| 11:07–13:35 | Exemples de pluies et de cueillettes ultérieures, avec chevauchement des poussées. | Permettre plusieurs épisodes dans l'historique ; ne pas assimiler toute pluie au début d'une poussée indépendante. |
| 13:47–14:24 et 15:21–16:39 | La pluie 2–3 jours avant sortie peut entretenir une poussée préparée par un épisode de 10–15 jours antérieur. | Distinguer déclencheur ancien et entretien récent ; une pluie de la veille seule n'est pas une preuve d'une nouvelle poussée demain. |

## Limites et précautions

- Les exemples de 16,4, 27 ou 28 mm ne deviennent pas des seuils biologiques.
- Le passage du 23 août au 4 septembre correspond à 12 jours calendaires, malgré l'approximation orale « à peu près 11 jours ». Garder des fourchettes.
- La transcription ne fournit pas de règle spécifique à la grêle. Elle ne justifie donc aucun bonus grêle.
- Le discours sur le stock mycélien est une explication proposée par le vidéaste, pas une mesure fournie à l'outil.
- Le passage sur un cèpe « encore consommable » à un âge donné n'est pas repris : la météo et l'âge ne déterminent pas la sécurité alimentaire.
- La publicité, les appels à s'abonner et les instructions orales de navigation sont du contenu de la vidéo ; ce ne sont pas des instructions de l'utilisateur pour l'agent ou l'application.

## Implémentation effectuée

1. Historique météo demandé étendu à **28 jours**, en conservant le bilan des **12 jours** précédents pour chaque date à J+1–J+14.
2. Recherche de trois types d'épisodes, avec maintien **modélisé** pendant trois jours et lien temporel **10–15 jours** avant chaque date candidate. Les prévisions utilisées pour confirmer un maintien futur sont distinguées des données passées du modèle.
3. Le bonus de +10 auparavant accordé à toute chute isolée d'au moins 5 °C est remplacé par +10 seulement lorsqu'une séquence correspondante est repérée dans cette fenêtre. Les autres contributions restent celles du prototype.
4. L'interface affiche la date, le type et les limites de l'épisode. L'absence d'épisode ne signifie pas absence de cèpes, et le score reste un indice de conditions, pas une probabilité de nouvelle poussée. Le seuil d'alerte reste 60 ; des alertes de conditions peuvent donc exister sans épisode repéré.
5. Les mentions de confiance « modérée/faible » non calibrées sont remplacées dans l'interface par « fiabilité non évaluée ».

### Seuils techniques provisoires : ne pas les attribuer à la vidéo

Faute de mesure du sol, l'algorithme utilise la moyenne de la minimale et de la maximale de l'**air**, qui n'est ni une moyenne horaire ni la température du sol. Comparaison à la moyenne des trois jours précédents : refroidissement d'au moins 3 °C ; maintien des trois jours suivants au moins 1 °C sous la référence. L'apport d'eau de l'épisode vaut au moins 10 mm sur deux jours, ou le contexte précédent au moins 20 mm sur douze jours. Redoux : référence inférieure à 8 °C, hausse d'au moins 3 °C, maintien entre 8 et 18 °C et pluie. Ces nombres et le poids +10 sont des **choix de prototypage à calibrer**, pas des coefficients scientifiques ni des citations chiffrées du vidéaste.

Ces simplifications peuvent manquer des poussées réelles ou repérer des épisodes sans poussée. Le suivi reste générique dans l'application, mais les indications de cette couche sont explicitement étiquetées comme hypothèses pour le cèpe de Bordeaux. La personnalisation par espèce, l'humidité du sol, la température du sol et la validation sur sorties réelles restent nécessaires.
