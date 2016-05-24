# Librairie GRA.js

## Description
Librarie mettant à disposition des classes permettant de créer efficacement
des applications JavaScript.

Les programmes JavaScript seront divisés en module (**Application**) communiquant par le biais
d'un noyau (**Kernel**).

## Installation
Pour utiliser cette librairie, il suffit d'inclure le fichier __dist/gra.min.js__ : `<script src="dist/gra.min.js"></script>`  
En phase de développement, inclure plutôt le fichier __dist/gra.js__ afin de faciliter le débogage

## Utilisation
Dès l'inclusion du fichier __dist/gra.min.js__, un `Kernel` est créé.
Par défaut, le `Kernel` n'est pas en mode DEBUG. Pour le passer en mode
DEBUG, il suffit de le spécifier via la méthode `setDebug` du `Kernel` :
`GRA.kernel.Kernel.setDebug(true);`

------------

Ensuite il suffit de "booter" (amorcer) chaque application en utilisant la méthode `boot` du `Kernel`,
puis de démarrer les applications en utilisant la méthode `startAll`:

    var kernel = GRA.kernel.Kernel;

    // "Booter" une application
    kernel.boot(function () {
       var application = kernel.createApplication('appOne');

       // L'événement "start" est déclenché lors de l'appel
       // de la méthode 'start' du Kernel
       application.on('start', function () {
            alert('Hello World !');
       });

       return application; // Envoi de l'application au noyau
    });

    kernel.startAll(); // Démarrer toutes les applications

## Tests
Pour lancer les tests, ouvrir le fichier __test/index.html__ dans un navigateur web.
Il est aussi possible de lancer les tests via la commande `grunt test`

## Documentation
Rendez-vous dans le dossier __docs__ pour consulter la documentation du code.

## TODO
* Commenter les classes et méthodes non commentées
* Finir les fichiers README.md de chaque namespace
* Mettre à jour le fichier __exemple.html__
* Finir les tests
* Ajouter un fichier HTML de test (QUnit) pour chaque namespace
* *Supprimer la classe GRA.datastructure.LinkedList ?*

## API
* GRA.ajax
    * Ajax
    * Factory
* GRA.datastructure
    * BinarySearchTree
    * LinkedList
    * Map
    * Queue
    * Stack
    * Vector
* GRA.dom
    * JQueryProxy
* GRA.form
    * Form
    * Validator
* GRA.fn
    * ExecutionQueue
    * Manager
    * Promise
* GRA.kernel
    * Application
    * Bus
    * Kernel
    * Message
* GRA.model
    * Model
* GRA.storage
    * local
    * session
* GRA.utils
    * ArrayUtils
    * DateUtils
    * is
    * ObjectUtils
    * StringUtils
    * TokenUtils