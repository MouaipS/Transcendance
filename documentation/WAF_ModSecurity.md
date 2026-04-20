# WAF / ModSecurity

## Pourquoi un WAF / ModSecurity ?

Le Module Major CyberSecurity demande d’implanter un WAF / ModSecurity. Le niveau de sécurité doit être “hardened” et strict. 

- Strict : Un blocage actif (pas seulement de detection), applications des règles OWASP. Strict signifie une configuration restrictive avec un niveau de paranoia 3-4 et une validation des entrées. Le risque des faux-positifs est plus élevés.
- Hardened : Pas de modules inutiles, configuration obsolètes, avoir un TLS fort (versions et cipher suites sécurisés), des headers de sécurités ( HSTS, CSP, X-Frame-Options).

Le but est d’avoir un blocage actif, une faible surface d’attaque et des accès controlés.

## WAF (Web Application Firewall)

Un **WAF** est un dispositif de sécurité placé devant une application web pour **surveiller, filtrer et bloquer** le trafic HTTP/HTTPS malveillant.

Il sert à protéger l’application contre des attaques ciblant la couche applicative (couche 7), par exemple :

- injections SQL
- XSS (Cross-Site Scripting)
- traversée de répertoires (path traversal)
- attaques sur paramètres, cookies, en-têtes HTTP
- tentatives d’exploitation de failles connues

Un WAF fonctionne généralement à partir de **règles** et peut aussi appliquer des mécanismes comme la limitation de débit (rate limiting), le blocage d’IP, ou la détection de bots.

---

## ModSecurity

**ModSecurity** est un **WAF open source** (souvent appelé *WAF applicatif*) qui s’intègre principalement comme module ou composant devant un serveur web / reverse proxy.

- Historiquement, il est très utilisé avec **Apache**, et existe aussi pour **Nginx** (via un connecteur) ainsi que d’autres architectures (selon la version et le déploiement).
- Il s’appuie sur un langage de règles (**SecRules**) pour inspecter les requêtes/réponses HTTP et appliquer des actions (logger, bloquer, rediriger, etc.).

ModSecurity est fréquemment déployé avec l’**OWASP Core Rule Set (CRS)**, un ensemble de règles maintenu par la communauté OWASP visant à détecter et atténuer les attaques web courantes. Il y a environ 150 règles, chacune détecte un pattern d’attaque spécifique et ModSecurity c’est le moteur qui exec les règles.

En résumé :

- **WAF** = la *fonction* / la *catégorie* de protection.
- **ModSecurity** = une *implémentation* (outil) de WAF, très répandue et extensible via des règles.

---

### NGINX

L’image Nginx a été changé pour `owasp/modsecurity-crs:nginx-alpine` . Contrairement à une configuration classique, le default.conf est déplacé dans le folder template. En effet, cette nouvelle image fonctionne différemmennt de la classique. Cette nouvelle image est “configurable” : au commencement, un script shell s’execute et lit les fichiers present dans /etc/nginx/templates/. Il remplace les ${variables}  par les env. Il écrit ensuite le résultat dans le folder /etc/nginx et alors Nginx demarre normalement. C’est simplement une étape supplémentaire. 
Pour rentrer plus spécifiquement dans les détails, ce remplacement de variables est fait par `envsubst`. Cet script Unix est fait pour le remplacement de variable d’environnement pour avoir une configuration polyvalente. 
Pour être encore plus précis, l’image “configurable” est une image avec un pipeline de traitement ⇒ lit les templates, fait envsubst et écrit tout dans /etc/nginx/conf.d

### Configuration de ModSecurity

Pour que ModSecurity fonctionne comme voulu, on lui donne des variables d’environnements spécifiques qui ont un impact sur le reverse proxy et l’interpretation des requetes. 

- PARANOIA : C’est le niveau de SecRules maximum applicable sur les requetes. Il va de 1 à 4. Pour du hardened il doit au moins être à 2. (4 bloque les apostrophes donc pas impossible avec le chat, le 3 peut etre envisageable mais à verifier une fois le projet plus avancé).
- BLOCKING_PARANOIA : C’est le niveau reellement appliqué sur les requetes. On le fait normalement monté progressivement vers PARANOIA
- MODSEC_RULE_ENGINE : c’est l’application des regles, est-ce que on bloque, on inspecte ou on ne fait rien
- ANOMALY_INBOUND : Score max pour qualifier une requete entrante comme une erreur
- ANOMALY_OUTBOUND : Pareil que INBOUND mais pour requete exterieur.

Systeme de scoring : les regles CRS bloquent pas directement, chaque règle ajoute des points au score final. Si à la fin de l’eval, le score depasse INBOUND ou OUTBOUND, la requete est bloquée.

### Configuration NGINX

Pour garder l’aspect strict du projet, il faut appliquer une politique de securité à nginx. On lui ajoute des headers qui vont dire au navigateur comment interpreter les requetes sortantes. On va met en place des protections contre des attaques types comme le clickjacking, les injections XSS ou encore les attaques par sniffing. 

- server_tokens off ⇒ pour retirer a version utilisé d’Nginx. Cela permet de bloquer des attaques basés sur les versions.
- add_header X-Frame-Options "DENY" always ⇒ Pour empecher le clickjacking par utilisation de iframe depuis un site exterieur.
- add_header X-Content-Type-Options "nosniff" always ⇒ Contre le sniffing, on dit au navigateur de faire confiance au MIME type de la requete
- add_header Content-Security-Policy ⇒ Le CSP est une liste blanche de source autorisées. Ce qui ne vient pas de la liste blanche est forbidden. C’est une grosse défense contre le XSS : meme si un attaquant a reussi à injecter un scirpt dans une page, le nav refuse de l’exec car pas dans la liste.
- add_header Strict-Transport-Security "max-age=150" always ⇒ Il force le navigateur à utiliser HTTPS pour ce domaine pendant X temps. C’est une protection contre le SSL Stripping. Avec un HSTS save, le nav ne fait plus de HTTP.
- add_header Referrer-Policy ⇒ Protection en cas de lien vers un site exterieur qui pourrait être compromis. Ici, la requete ne contient pls l’URL complete de la page mais seulement le domaine. On evite la fuite de paths ou de tokens.

<aside>

⚠️ Le CSP contient 2 unsafe - c’est pour Vite, ça reduit la protection contre le XSS, qui en a besoin car il injecte du JS inline dans les requetes. 

</aside>