# GRA.kernel

## Description
Ce module permet la création d'application dont la communication inter-application
et la communication avec le client sont gérées par un noyau.

## GRA.kernel.Kernel

### Généralités
Le `Kernel` est une classe représentant le noyau centrale de tout le programme JavaScript.  
Celui-ci est créé automatiquement à l'inclusion de la librairie __GRA.js__, il n'y a pas besoin de l'instancier soi-même.

Pour utiliser le `Kernel`, il suffit de le manipuler directement via son instance `GRA.kernel.Kernel` : 

    var kernel = GRA.kernel.Kernel;
    
En phase de développement, le kernel peut s'activer en mode DEBUG. Pour cela, il faut lui spécifier
grâce à la méthode `setDebug(debug)` : 

    // Le Kernel n'est pas en mode DEBUG
    var kernel = GRA.kernel.Kernel;
    
    // Le Kernel est maintenant en mode DEBUG
    kernel.setDebug(true);
    
    // Le Kernel n'est plus en mode DEBUG
    kernel.setDebug(false);

Pour communiquer avec le client, le Kernel met à disposition diverses méthodes :

* `notify(message, type)` : Informer l'utilisateur (succès ou information)
* `raiseError(message)` : Informer l'utilisateur qu'une erreur s'est produite
* `warn(message)` : Avertir l'utilisateur

Voici un exemple : 

    var kernel = GRA.kernel.Kernel;
    
    kernel.notify("Information"); // Affiche un message d'information à l'utilisateur
    kernel.notify("Succès", "success"); // Affiche un message de succès à l'utilisateur
    kernel.raiseError("Erreur"); // Affiche un message d'erreur à l'utilisateur
    kernel.warn("Attention"); // Affiche un message d'avertissement à l'utilisateur

La gestion des API se fait aussi par le biais du `Kernel`.  
Le `Kernel` possède deux méthodes `provide(componentName, component)` (permettant de fournir un composant à chaque application qui
sera bootée) et `conceal(componentName)` (permettant de retirer un composant de l'API) : 

    var kernel = GRA.kernel.Kernel;
    
    kernel.provide('ajax.factory', new GRA.ajax.Factory()); // Met à disposition un service nommé 'ajax.factory'
    
    kernel.conceal('ajax.factory'); // Retirer le service 'ajax.factory' de l'API

### Booter des applications
Le but premier du Kernel est de pouvoir gérer le comportement des applications (modules) qui formeront le programme JavaScrit.  
Le Kernel ne sait gérer que des instances de la classe `GRA.kernel.Application`.  
Pour booter une application, il faut utiliser la méthode `boot(applicationBuilder)` qui prend en paramètre une fonction retournant
une instance de la classe `GRA.kernel.Application`.

    var kernel = GRA.kernel.Kernel;
    
    kernel.boot(function () {
        // Créer une instance d'Application [équivalent à 'new GRA.kernel.Application("appOne")]'
        var application = kernel.createApplication('appOne'); 
        
        //...Configuration de l'application
        
        // Envoi de l'application au Kernel
        return application;
    });
    
Le "bootage" d'une application se fait au travers d'une fonction afin de s'assurer que seul le Kernel puisse
modifier le comportement d'une application.  
Si une application doit communiquer avec une autre (par exemple récupérer des données d'une autre application), 
cela se fera par l'envoi de messages entre application à travers le `Kernel`.
Une application peut envoyer un message grâce aux méthodes :
 
* `sendTo(applicationName, message)` où __applicationName__ est le nom de l'application destinataire et __message__ 
    une instance de la classe `GRA.kernel.Message`
* `broadcast(message)` où __message__ est une instance de la classe `GRA.kernel.Message`

Alors que `sendTo` envoie le message à une seule application, la méthode `broadcast` envoie le message à toutes les applications du
`Kernel`.  
Pour créer un message, il faut soit créer une nouvelle instance de `GRA.kernel.Message`, 
soit passer par la méthode `createMessage(code, description)` de la classe `GRA.kernel.Application`.

### Démarrer des applications
Une fois les applications bootées, il faut les démarrer. Pour cela, il y a deux façons :

* Démarrer application par application via la méthode `start(applicationName)`
* Démarrer toutes les applications via la méthode `startAll()`  

Voici ci-dessous un exemple : 

    var kernel = GRA.kernel.Kernel;
    
    // Amorçage des applications
    kernel.boot(function () {...}); // Amorce l'application nommée 'appOne'
    kernel.boot(function () {...}); // Amorce l'application nommée 'appTwo'
    
    // Démarrer application par application
    kernel.start('appOne');
    kernel.start('appTwo');
    
    // Ou bien tout démarrer en une seule fois
    kernel.startAll();
    
### Stopper des applications
Une fois les applications démarrées, il est possible de les stopper.  
Pour cela, le Kernel fournit deux méthodes similaires aux méthodes de démarrage : 

* `stop(applicationName)` pour stopper une seule application
* `stopAll()` pour stopper toutes les applications

Voici ci-dessous un exemple : 

    var kernel = GRA.kernel.Kernel;
    
    kernel.boot(function () {...}); // Amorce l'application nommée 'appOne'
    kernel.boot(function () {...}); // Amorce l'application nommée 'appTwo'
    
    kernel.startAll();
    
    kernel.stop('appOne'); // Stoppe l'application nommée 'appOne'
    kernel.stopAll(); // Stoppe toutes les applications
    
## GRA.kernel.Application
### Description
Une application est à considérer comme un module à part entière du programme JavaScript.
Par exemple, si une page web propose divers onglets ayant chacun un contenu différent fonctionnant avec du code JavaScript,
il sera tout à fait possible qu'une application serait un seul onglet.  
Le principe à retenir est qu'une application ne doit impacter aucune autre : 

* Si une application lève une erreur, celle-ci ne doit pas affecter les autres applications
* Si une application est stoppée, ceci ne doit pas affecter les autres
* Si une application est supprimée (physiquement du code), la suppression de celle-ci ne doit pas empêcher
  les autres de fonctionner
  
### Création d'une application
Comme vu précédemment, une application doit être créée dans une fonction via la méthode `boot` du `Kernel`.  
Créer une application consiste à spécifier le comportement de l'application au travers de différents événements.  
Par défaut, le Kernel déclenche :

* l'événement __boot__ d'une application lors de l'amorçage de celle-ci
* l'événement __start__ d'une application lors du démarrage de celle-ci
* l'événement __stop__ d'une application lors de l'arrêt de celle-ci
* l'événement __message__ d'une application lorsque celle-ci reçoit un message

Bien sûr, si ces événements ne sont pas spécifiés à la création de l'application, rien ne se produira.  
Le minimum à implémenter est l'événement __start__.  
Voici ci-dessous un exemple de création complet d'une application : 

    var kernel = GRA.kernel.Kernel;
    
    kernel.boot(function () {
        var application = kernel.createApplication('appOne');
        
        application.on('boot', function () {
            application.notifyUser("Je suis amorçée."); // Equivaut à l'appel de la fonction Kernel::notify(message, type)
        });
        
        application.on('start', function () {
            application.notifyUser("Je suis démarrée", "success");
        });
        
        application.on('message', function (message) {
            // Le paramètre 'message' est une instance de la classe GRA.kernel.Message
            var description = message.getDescription();
            
            application.notifyUser("J'ai reçu le message suivant : " + description);
        });
        
        application.on('stop', function () {
            application.warnUser("J'ai été stoppée"); // Equivaut à l'appel de la fonction Kernel::warn(message)
        });
        
        return application;
    });
   
    // L'événement 'boot' de l'application sera déclenchée
    
    // L'événement 'start' de l'application sera déclenchée
    kernel.startAll();
    
    // L'événement 'stop' de l'application sera déclenchée
    kernel.stopAll();