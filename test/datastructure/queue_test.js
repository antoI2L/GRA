QUnit.module('GRA.datastructure.Queue');

QUnit.test("Création d'une file", function (assert) {
    var queue = new GRA.datastructure.Queue();

    assert.ok(queue.isEmpty(), "La file doit être vide");
    assert.equal(0, queue.size(), "La taille de la file doit être 0");
});

QUnit.test("Ajout d'éléments dans une file", function (assert) {
    var queue = new GRA.datastructure.Queue();

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    
    assert.notOk(queue.isEmpty(), "La file ne doit plus être vide");
    assert.equal(3, queue.size(), "La taille de la file doit être 3");
    assert.equal(1, queue.head(), "La tête de la file doit être 1");
    assert.equal(3, queue.tail(), "La queue de la file doit être 3");
});

QUnit.test("Suppression d'éléments dans une file", function (assert) {
    var queue = new GRA.datastructure.Queue(),
        head;

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    head = queue.dequeue();
    assert.equal(2, queue.size(), "La taille de la file doit être 2");
    assert.equal(1, head, "L'élément défilé doit être 1");

    head = queue.dequeue();
    assert.equal(1, queue.size(), "La taille de la file doit être 1");
    assert.equal(2, head, "L'élément défilé doit être 2");

    head = queue.dequeue();
    assert.equal(0, queue.size(), "La taille de la file doit être 0");
    assert.equal(3, head, "L'élément défilé doit être 3");
});

QUnit.test("Réduction d'une file", function (assert) {
    var queue = new GRA.datastructure.Queue(),
        sum;

    assert.expect(7);

    queue.enqueue(2);
    queue.enqueue(3);
    queue.enqueue(10);

    sum = queue.reduce(function (prev, next, index) {

        if (2 === index) {
            assert.equal(0, prev, "A l'indice 2, le précédent doit être 0");
            assert.equal(2, next, "A l'indice 2, le suivant doit être 2");
        } else if (1 === index) {
            assert.equal(2, prev, "A l'indice 1, le précédent doit être 2");
            assert.equal(3, next, "A l'indice 1, le suivant doit être 3");
        } else if (0 === index) {
            assert.equal(5, prev, "A l'indice 0, le précédent doit être 5");
            assert.equal(10, next, "A l'indice 0, le suivant doit être 5");
        }

        return prev + next;
    }, 0);

    assert.equal(15, sum, "La somme doit être égale à 15");
});