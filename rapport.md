# TP3 : Full Stack

## Objectifs du TP

-   corriger le docker-compose pour que l'application démarre correctement
-   modifier la gestion des prix en centimes dans la base
-   s'assurer que les horaires des boutiques n'entrent pas en conflit

*   améliorer de manière générale la qualité du code
*   rendre l'interface responsive
*   indexer la base de données pour permettre des accès plus rapides

## Docker Compose

Le docker compose fourni avec ce projet ne semble pas fonctionner correctement, comme décrit dans le $\texttt{README.md}$, il semble que le backend n'attende pas que la base de données ait démarrée pour se lancer, ce qui provoque des erreurs de connexion.

Pour corriger ce problème, nous ajoutons un 'healthcheck' aux containers concernés :

**shop-db**

```
db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 10
```

**shop-server**

```
elasticsearch:
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 30
```

Pour elasticsearch, j'ai également dû ajouter une propriété d'environnement :

```
environnement:
      ES_JAVA_OPTS: "-Xms512m -Xmx512m"
```

car elasticsearch demande beaucoup de mémoire et sans cela, le processus est tué.

Un problème peut toujours être apercu dans les logs concernant le sniffer d'elasticsearch :

```
shop-server         | java.net.ConnectException: Connection refused
shop-server         |   at java.base/sun.nio.ch.SocketChannelImpl.checkConnect(Native Method) ~[na:na]
shop-server         |   at java.base/sun.nio.ch.SocketChannelImpl.finishConnect(SocketChannelImpl.java:777) ~[na:na]
shop-server         |   at org.apache.http.impl.nio.reactor.DefaultConnectingIOReactor.processEvent(DefaultConnectingIOReactor.java:174) ~[httpcore-nio-4.4.15.jar!/:4.4.15]
shop-server         |   at org.apache.http.impl.nio.reactor.DefaultConnectingIOReactor.processEvents(DefaultConnectingIOReactor.java:148) ~[httpcore-nio-4.4.15.jar!/:4.4.15]
shop-server         |   at org.apache.http.impl.nio.reactor.AbstractMultiworkerIOReactor.execute(AbstractMultiworkerIOReactor.java:351) ~[httpcore-nio-4.4.15.jar!/:4.4.15]
shop-server         |   at org.apache.http.impl.nio.conn.PoolingNHttpClientConnectionManager.execute(PoolingNHttpClientConnectionManager.java:221) ~[httpasyncclient-4.1.5.jar!/:4.1.5]
shop-server         |   at org.apache.http.impl.nio.client.CloseableHttpAsyncClientBase$1.run(CloseableHttpAsyncClientBase.java:64) ~[httpasyncclient-4.1.5.jar!/:4.1.5]
shop-server         |   at java.base/java.lang.Thread.run(Thread.java:829) ~[na:na]
shop-server         |
shop-server         | 2025-12-02 07:27:52.417 DEBUG 1 --- [pool-1-thread-1] o.a.h.i.n.c.InternalHttpAsyncClient      : [exchange: 6] connection request failed
shop-server         | 2025-12-02 07:27:52.421 ERROR 1 --- [nt_sniffer[T#1]] org.elasticsearch.client.sniff.Sniffer   : error while sniffing nodes
shop-server         |
```

Néanmoins, pour cette partie du projet, j'ai préféré ne modifier que le $\texttt{docker-compose.yml}$ en partant du principe que le code fonctionne, donc je n'ai pas corrigé ce problème pour l'instant, et cela n'empêche l'application de fonctionner.

## Montés de versions

| Technologie | Version de départ | Version ciblée |
| ----------- | ----------------- | -------------- |
| Spring Boot | 2.7.5             | 4.0.0          |
| JDK         | 11                | 24             |
| React       | ?                 | 19             |

### Spring Boot

On remarque ici qu'on passe d'une version inférieure à la 3.0.0 à une version supérieur. Cette migration provoque des breaking changes qu'on va devoir fixer :

-   Migration de javax $\to$ jakarta : Toutes les dépendances utilisant javax doivent être mises à jour pour utiliser jakarta à la place.
    -   spring-boot-starter-validation : 4.0.0
    -   postgresql : 42.7.8
    -   remplacer partout dans le code les imports de javax par des imports de jakarta.
    -   remplacer springfox car cette dépendance n'a pas été mise à jour.

### React

Pour monter de version sur React, on utilise l'outil officiel `codemod` qui vient mettre à jour des aspects particulier du code source d'un projet pour le rendre compatible avec la nouvelle version après avoir installé la nouvelle version de react, idem pour typescript :

```
$ npm install --save-exact react@^19.0.0 react-dom@^19.0.0
$ yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
$ npx codemod@latest react/19/migration-recipe
```
