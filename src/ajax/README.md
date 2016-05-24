# GRA.ajax

## Description
Ce module permet d'effectuer des requêtes asynchrones sur un serveur.

## Utilisation
Pour créer une nouvelle requête, il suffit de passer par l'intermédiaire
de la classe `GRA.ajax.Factory`.  
La classe `GRA.ajax.Factory` met à disposition trois méthodes :

* `createRequest()` permettant de créer une simple requête
* `createJsonRequest()` permettant de créer une requête dont la réponse sera du JSON
* `createXmlRequest()` permettant de créer une requête dont la réponse sera du XML

La requête créée est alors une instance de la classe `GRA.ajax.Ajax`. 

    // Création d'une requête
    var request = GRA.ajax.Factory.createJsonRequest();

est équivalent à

    // Création d'une requête (sans que le type de réponse soit spécifié)
    var request = GRA.ajax.Factory.createRequest();
    
    // On spécifie que le type de réponse sera du JSON
    request.setResponseType(GRA.ajax.const.type.JSON);

Une fois la requête créée, il est possible de lui ajouter des paramètres
grâce à la méthode `Ajax::add(paramName, paramValue)`.


    var request = GRA.ajax.Factory.createJsonRequest();

    // Le paramètre term=value sera passée à la requête
    request.add('term', 'value');
    
La requête peut être envoyée sous plusieurs méthodes :

* __DELETE__ en utilisant la méthode `Ajax::delete(source, onSuccess)`
* __GET__ en utilisant la méthode `Ajax::get(source, onSuccess)`
* __HEAD__ en utilisant la méthode `Ajax::head(source, onSuccess)`
* __POST__ en utilisant la méthode `Ajax::post(source, onSuccess)`
* __PUT__ en utilisant la méthode `Ajax::put(source, onSuccess)`

Il est aussi possible d'envoyer la requête en spécifiant la méthode dans
la méthode `Ajax::send(method, source, onSuccess)`.

    var request = GRA.ajax.Factory.createJsonRequest();

    request.add('term', 'value');

    // Envoi de la requête en GET
    // La chaîne de requête (querystring) sera '/path/to/source?term=value'
    request.get('/path/to/source', function (data) {
        // data contient le JSON reçu
    });