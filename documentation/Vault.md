# Vault

## Pourquoi un Vault ?

Le Module Major CyberSecurity demande l'implantation d'un HashiCorp Vault. Le but est de "manage secrets in Vault (API keys, credentials, environment variables), encrypted and isolated". L'ensembles des informations "sensibles", des accès, des secrets.

## Qu'est-ce qu'un vault ? Comment ça fonctionne ?
C'est litteralement un coffre fort qui protege les informations sensibles d'une application. Au demarrage de l'application, le Vault recupère les secrets et les stockes. Si les divers services de l'application ont besoin de certaines informations présentent dans le vault, par l'utilisation d'un token particulier, ils peuvent demander 

## Installlation & configuration

## Usage

## Source



## Divers

le dossier vault/init/ stocke le root token et les unseal keys -> l'absence ou non de ces fichiers determine la procedure de demarrage pour le vault.

