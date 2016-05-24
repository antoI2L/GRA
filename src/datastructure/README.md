# GRA.datastructure

## Description
Ce module fournit six structures de données :
    
* Arbre Binaire (de Recherche) : Classe `GRA.datastructure.BinarySearchTree()`
* File (FIFO) : Classe `GRA.datastructure.Queue()`
* Liste Chaînée : Classe `GRA.datastructure.LinkedList()`
* Map (Dictionnaire) : Classe `GRA.datastructure.Map()`
* Pile (LIFO) : Classe `GRA.datastructure.Stack()`
* Vector : Classe `GRA.datastructure.Vector()`

## Arbre Binaire de Recherche
Pour créer un arbre binaire de recherche, il suffit de créer une instance de la
classe `GRA.datastructure.BinarySearchTree()` :

    var tree = new GRA.datastructure.BinarySearchTree();
    
Ensuite, il suffit juste de lui ajouter des noeuds.  
Cela se fait par l'intermédiaire de la méthode `add(nodeId, nodeValue)` :

    var tree = new GRA.datastructure.BinarySearchTree();

    // Le premier noeud ajouté sera la racine.
    tree.add('r', 'root');

    // Les autres noeuds seront ajoutés dans l'arbre normalement
    // Les méthodes add() sont chaînables
    tree.add('a', 'aaaa').add('z', 'zzzz');
    
Pour rechercher une valeur dans l'arbre, il faut passer par la méthode `search(nodeId, strategy)`.
La classe `BinarySearchTree` fournit une stratégie de recherche par défaut : la profondeur d'abord (depth first) :

    var tree = new GRA.datastructure.BinarySearchTree();

    tree.add('r', 'root')
        .add('a', 'aaaa')
        .add('z', 'zzzz');
    
    // Recherche de la valeur du noeud 'a' en utilisant la profondeur d'abord
    tree.search('a', tree.DEPTH_FIRST);

Les ID des noeuds peuvent être de n'importe quel type.  
Lors de l'ajout d'un noeud, les noeuds sont comparés en utilisant une fonction de
comparaison simple. Il est possible de spécifier à l'arbre d'utiliser une autre fonction
de comparaison :

    var tree = new GRA.datastructure.BinarySearchTree();
        
    // Fonction de comparaison personnalisée
    // Elle doit retourner : 
    //   0 si les deux valeurs sont égales
    //   1 si a est supérieur à b
    //   -1 si a est inférieur à b
    tree.setComparator(function (a, b) {
        var result = 1;
        
        if (a.id === b.id) {
            result = 0;
        } else if (a.id < b.id) {
            result = -1;
        }
        
        return result;
    });
    
    tree.add({id: 0}, 'root').add({id: 1}, 'un');

## File (FIFO)
Une file est une structure de type FIFO (First In First Out).
Pour créer une file, il suffit de créer une instance de la classe `GRA.datastructure.Queue()` :

    var queue = new GRA.datastructure.Queue();
    
Pour enfiler des valeurs dans la file, il suffit d'utiliser la méthode `enqueue(value)` : 

    var queue = new GRA.datastructure.Queue(),
        value;
    
    // Enfiler les valeurs 1 puis 2
    queue.enqueue(1);
    queue.enqueue(2);
    
    value = queue.size(); // Retourne 2
    value = queue.isEmpty(); // Retourne false
    value = queue.head(); // Retourne 1
    value = queue.tail(); // Retourne 2

Pour les défiler, il suffit cette fois-ci d'utiliser la méthode `dequeue()` : 

    var queue = new GRA.datastructure.Queue(),
        value;
    
    queue.enqueue(1);
    queue.enqueue(2);
    
    value = queue.dequeue(); // Retourne 1
    value = queue.size(); // Retourne 1
    value = queue.dequeue(); // Retourne 2
    value = queue.isEmpty(); // Retourne true

## Liste chaînée
Pour créer une liste chaînée, il suffit de créer une instance de la classe `GRA.datastructure.LinkedList` : 

    var linkedList = new GRA.datastructure.LinkedList();
    
Pour ajouter des valeurs à la liste chaînée, il faut utiliser la méthode `add(value)` : 

    var linkedList = new GRA.datastructure.LinkedList(),
        value;
    
    linkedList.add(0);
    linkedList.add(1);
    
    value = linkedList.isEmpty(); // Retourne false
    value = linkedList.size(); // Retourne 2
    
Pour rechercher une valeur, il suffit d'utiliser la méthode `get(index)` en précisant
la position de l'élément dans la liste : 

    var linkedList = new GRA.datastructure.LinkedList(),
        value;
    
    linkedList.add(1);
    linkedList.add(2);
    
    value = linkedList.get(0) // Retourne 1
    value = linkedList.get(1) // Retourne 2
    
Pour supprimer une valeur, il suffit d'utiliser la méthode `removeAt(index)` en précisant
la position de l'élément à supprimer dans la liste : 

    var linkedList = new GRA.datastructure.LinkedList(),
        value;
    
    linkedList.add(1);
    linkedList.add(2);
    linkedList.removeAt(0);
    
    value = linkedList.get(0); // Retourne 2
    value = linkedList.size(); // Retourne 1
    
## Map (Dictionnaire)
Pour créer une Map, il suffit de créer une instance de la classe `GRA.datastructure.Map()` : 

    var map = new GRA.datastructure.Map();
    
Pour ajouter des données dans la Map, il faut utiliser la méthode `put(key, value)`, et pour
récupérer des données, il faut utiliser la méthode `get(key)` : 

    var map = new GRA.datastructure.Map(),
        value;
    
    value = map.isEmpty(); // Retoure true
    value = map.size(); // Retourne 0
    
    // Ajout de données dans la Map
    map.put('a', 5);
    map.put('b', 10);
    
    value = map.isEmpty(); // Retoure false
    value = map.size(); // Retourne 2
    value = map.get('a'); // Retourne 5
    value = map.get('b'); // Retourne 10
    
## Pile (LIFO)
Une pile est une structure de type LIFO (Last In First Out)
Pour créer une pile, il suffit de créer une instance de la classe `GRA.datastructure.Stack()` :

    var stack = new GRA.datastructure.Stack();

## Vector
Un Vector se manipule comme un Vector en Java, à la différence qu'il n'est pas typé.
Pour créer un Vector, il suffit de créer une instance de la classe `GRA.datastructure.Vector()` :

    var vector = new GRA.datastructure.Vector();