# Recherche sur les cèpes et conséquences pour le modèle

Consultation : 27 octobre 2026. Le score reste un indice expérimental non calibré, pas une probabilité. Les tests logiciels ne valident pas la prévision biologique.

## Méthode et accès

Lecture du texte de huit articles de Chasseurs de Champignons, en séparant contenu éditorial et commentaires. Ce sont huit articles d'un **même éditeur commercial**, pas huit validations indépendantes. Recherche de publications via Crossref et OpenAlex ; les résultats scientifiques ci-dessous sont tirés de leurs **résumés**, pas d'une lecture des textes intégraux. Les articles simplement repérés sans résumé ne servent pas de preuve. Champignons Passion a retourné une erreur HTTP 503 et n'est pas utilisé comme source lue.

## Sources de terrain effectivement lues

Tous les articles suivants sont signés « cdc-admin ». Ce sont des conseils de cueillette, sans protocole de validation prédictive dans les pages consultées.

| Source | Date affichée | Ce qu'elle indique | Usage et limite |
|---|---|---|---|
| [Influence de la pluie sur les champignons](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/influence-de-la-pluie-sur-les-champignons/) | 25/01/2023 | Ordre de grandeur d'une dizaine de jours après pluie ; en période durablement humide, la fructification peut continuer sans attendre une nouvelle pluie. | Distinguer réhumidification après sécheresse et humidité entretenue. Le découpage annoncé en 3 + 7 jours n'est pas une loi universelle. |
| [En combien de temps pousse un cèpe ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/en-combien-de-temps-pousse-un-cepe/) | 10/02/2022 | Croissance du primordium à l'adulte variable, présentée comme 7 à 20 jours selon humidité et température ; vent desséchant. | Ne pas confondre croissance d'un champignon déjà formé et délai pluie–apparition. Aucun coefficient de vent n'en est déduit. |
| [Saison des cèpes : quand les ramasser ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/saison-des-cepes-quand-les-ramasser/) | 10/02/2022 | Délai pluie–fructification annoncé de 7 à 12 jours dans une situation favorable ; différences selon climat, humidité initiale et espèce. | Hypothèse de délai à tester, pas verrou systématique à J+7 ou J+12. |
| [Où et quand trouver des cèpes ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/ou-et-quand-trouver-des-cepes/) | 28/06/2021 | Distingue edulis, pinophilus, aestivalis et aereus ; préférences thermiques, habitats et arbres hôtes différents. | Justifie des profils par espèce ; les limites d'altitude et dates proposées restent des repères régionaux. |
| [Où poussent les cèpes en montagne ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/ou-poussent-les-cepes-en-montagne/) | 11/02/2022 | Importance du climat local, de l'altitude, des sols et des essences. | Ne pas appliquer un simple bonus d'altitude ; les conseils ne remplacent pas la météo du versant prospecté. |
| [Sous quels arbres poussent les cèpes ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/sous-quels-arbres-poussent-les-cepes/) | 16/02/2022 | Conseils d'association entre espèces de cèpes et feuillus/conifères. | Permet de guider la description d'un lieu. Les listes ne prouvent pas une présence ou une absence certaine. |
| [Quels champignons poussent sous quels arbres ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/quels-champignons-poussent-sous-quels-arbres/) | 06/05/2022 | Associations arbres–champignons plus larges. | Recoupement au sein du même éditeur, sans indépendance statistique ; certaines formulations absolues diffèrent de l'article précédent. |
| [Quel sol pour les cèpes ?](https://www.chasseursdechampignons.com/blog/comment-trouver-des-champignons/quel-sol-pour-les-cepes/) | 10/02/2022 | Sol, matière organique et préférences d'acidité selon espèce. | Ne pas copier les approximations : pH 6 reste acide ; la seule présence de « fougères » non identifiées ne mesure pas le pH d'une parcelle. |

Les articles de saison évoquent parfois mai–octobre, puis des périodes allant jusqu'à novembre, et les commentaires rapportent des récoltes plus tardives. Une date de calendrier ne doit donc pas déclencher une exclusion automatique partout en France.

## Résumés scientifiques consultés

### 1. Observations quotidiennes spécifiques à Boletus edulis

**Predicting porcini: a decade of sporocarp monitoring reveals the meteorological triggers of Boletus edulis fruiting in central European beech forests**. Prépublication openRxiv, publiée le 14/12/2025 selon Crossref, DOI [10.64898/2025.12.12.693895](https://doi.org/10.64898/2025.12.12.693895).

Statut vérifié : `posted-content`, aucun lien vers une version évaluée par les pairs dans les métadonnées consultées. Résumé consulté via OpenAlex et recoupé avec Crossref. Données quotidiennes 2015–2024 dans une hêtraie près de Bielefeld, Allemagne ; modèles mixtes avec effets retardés. Le résumé rapporte un pic associé à une température **moyenne** d'environ 13 °C sur les **20 jours précédents**, et une augmentation avec les précipitations cumulées sur **26 jours**.

Conséquence : tester plusieurs fenêtres de mémoire plutôt qu'un unique cumul à 12 jours. Ne pas transformer 13 °C en optimum universel, ni appliquer ces résultats aux quatre espèces, aux autres forêts ou à l'Occitanie sans validation. Le résumé ne fournit pas tous les coefficients, incertitudes et choix de modèle nécessaires pour reproduire le modèle publié. Il ne traite pas de grêle.

### 2. Série de longue durée en Suisse

**Linking climate variability to mushroom productivity and phenology** (2011), DOI [10.1890/110064](https://doi.org/10.1890/110064).

Résumé OpenAlex : suivi hebdomadaire de 65 631 champignons mycorhiziens, 273 espèces, de 1975 à 2006 dans une réserve suisse. La précipitation et les températures moyennes sont associées à l'activité fongique et à sa phénologie. Étude multiespèces et multiannuelle : elle étaye le choix des variables, pas des seuils quotidiens de récolte de cèpes à Brassac.

### 3. Variation spatiale et saisonnière européenne

**Explaining European fungal fruiting phenology with climate variability** (2018), DOI [10.1002/ecy.2237](https://doi.org/10.1002/ecy.2237).

Résumé OpenAlex : influences de la géographie, de l'altitude, du climat, des groupes trophiques et de la saison ; prédicteurs propres aux espèces variables. Justifie de distinguer contexte local, espèce et saison. Les décalages rapportés à grande échelle ne constituent pas une correction fixe de jours par mètre d'altitude.

### 4. Décalage historique des périodes de fructification

**Mushroom fruiting and climate change** (2008), DOI [10.1073/pnas.0709037105](https://doi.org/10.1073/pnas.0709037105).

Résumé OpenAlex : environ 34 500 observations d'herbier en Norvège, 1940–2006 ; variation des dates selon espèces, groupes et géographie. Renforce la prudence sur les calendriers immuables. Ni modèle de prévision locale à J+1, ni étude spécifique à la grêle.

### 5. Habitat et cèpe de Bordeaux

**Influence of some ecological variables on wild mushroom (Boletus edulis) productivity** (2019), DOI [10.17474/artvinofd.449736](https://doi.org/10.17474/artvinofd.449736).

Résumé Crossref/OpenAlex : 75 placettes à Bicik, différences selon exposition et pente, sans différence détectée entre classes d'altitude dans cette étude. Une absence d'effet dans cet échantillon n'est pas une absence générale d'effet. Aucun seuil météo journalier n'en est déduit.

### Travaux repérés, non exploités comme résultats

- [Effects of forest management and climatic variables on the mycelium dynamics and sporocarp production of the ectomycorrhizal fungus Boletus edulis](https://doi.org/10.1016/j.foreco.2017.01.025), 2017.
- [Primary productivity and climate control mushroom yields in Mediterranean pine forests](https://doi.org/10.1016/j.agrformet.2020.108015), 2020.
- [Climate-sensitive models for mushroom yields and diversity in Cistus ladanifer scrublands](https://doi.org/10.1016/j.agrformet.2015.07.001), 2015.

Métadonnées seulement, sans résumé disponible dans les réponses consultées : aucune conclusion quantitative attribuée à ces articles.

## Grêle : conclusion actuelle

Aucune preuve spécifique et vérifiée de hausse de fructification après grêle n'a été trouvée dans ce corpus. Cela ne prouve pas l'absence d'effet. Il faut distinguer apport d'eau, refroidissement et éventuel effet propre de la grêle ; l'affirmation « la grêle améliore systématiquement l'infiltration » n'est pas établie ici.

La pénalité −15 a été retirée. La grêle reste informative, sans bonus. Les codes météo WMO 96/99 ne sont pas des observations de grêle réellement tombée sur la parcelle. L'attribution d'un effet propre nécessitera des observations locales et une comparaison à pluie/température équivalentes.

## Changements immédiats et limites

- Suppression de la pénalité grêle non justifiée ; détail de chaque contribution visible.
- Suppression de la chute arbitraire de +40 à +22 lorsque la pluie cumulée dépasse 80 mm : le nouveau terme pluie vaut 0 sous 10 mm, +22 de 10 à moins de 20 mm et +40 à partir de 20 mm. **C'est une correction de cohérence du prototype, pas une formule issue d'une publication.** Elle ne signifie pas que l'engorgement est favorable ; le drainage et la saturation ne sont pas encore mesurés.
- Les autres poids et le seuil d'alerte 60 restent provisoires. Les mentions de confiance de l'ancienne version ne représentent aucune calibration statistique.

## Spécification pour une évolution fondée sur les observations

1. Conserver les 12 jours demandés et ajouter des contextes de 20 et 26 jours, après vérification de la couverture des données et du coût API.
2. Utiliser des températures moyennes et des données du sol lorsqu'elles sont disponibles ; distinguer mesures, réanalyse et prévision.
3. Décrire la séquence : état sec antérieur, épisode pluvieux, délai depuis celui-ci, maintien de l'humidité, vent et évapotranspiration. Une pluie de la veille ne doit pas suffire à prédire une nouvelle poussée demain, mais une poussée déjà amorcée ne doit pas être exclue.
4. Demander espèce recherchée et habitat : arbres, altitude réelle, exposition, sol si connu ; ne pas inventer un pH ou une essence à partir d'une commune.
5. Séparer indice de conditions propices et fiabilité des informations. Une prévision à J+14 doit afficher ses incertitudes ; 80 points ne signifie pas 80 % de chances.
6. Recueillir les sorties avec présence **et absence**, dates, espèces et effort de prospection. Évaluer hors des lieux et années de calibration, avec comparaison à un calendrier saisonnier simple. Mesurer les fausses alertes et le délai réellement obtenu avant les poussées.

Aucun nouveau coefficient n'est présenté comme validé par la seule accumulation d'articles de blog.
