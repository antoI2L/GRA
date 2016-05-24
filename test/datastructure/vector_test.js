QUnit.module('GRA.datastructure.Vector');

QUnit.test("Création d'un Vector", function (assert) {
    var vector = new GRA.datastructure.Vector();

    assert.equal(0, vector.size(), "La taille doit être égale à 0");
    assert.ok(vector.isEmpty(), "Le vector doit être vide");
});

QUnit.test("Ajout d'éléménts dans un Vector", function (assert) {
    var vector = new GRA.datastructure.Vector();

    vector.add(0, 1, 2, 5, 3, 4);

    assert.notOk(vector.isEmpty(), "Le vector ne doit pas être vide");
    assert.equal(6, vector.size(), "La taille doit être égale à 6");
    assert.ok(vector.has(5), "Le vector doit contenir le chiffre 5");
    assert.ok(vector.has(2), "Le vector doit contenir le chiffre 2");
    assert.equal(0, vector.firstElement(), "Le premier élément doit être le chiffre 0");
    assert.equal(4, vector.lastElement(), "Le dernier élément doit être le chiffre 4");
    assert.equal(4, vector.indexOf(3), "Le chiffre 3 doit se trouver à la 5ème position (4)");
    assert.equal(3, vector.elementAt(4), "Le chiffre à la 5ème position doit être le chiffre 3");
});

QUnit.test("Suppression d'éléments dans un Vector", function (assert) {
    var vector = new GRA.datastructure.Vector();

    vector.add(0, 1, 2, 5, 3, 4);

    vector.clear();

    assert.ok(vector.isEmpty(), "Le vector doit être vide après avoir appelé la méthode clear()");

    vector.add(0, 1, 2, 5, 3, 4);

    vector.removeElementAt(3);

    assert.equal(5, vector.size(), "La taille doit être égale à 5");
    assert.notOk(vector.has(5), "Le vector ne doit plus contenir le chiffre 5");

    vector.remove(0);

    assert.equal(4, vector.size(), "La taille doit être égale à 4");
    assert.notOk(vector.has(0), "Le vector ne doit plus contenir le chiffre 0");

    vector.removeAll([1, 3]);

    assert.equal(2, vector.size(), "La taille doit être égale à 2");
    assert.ok(vector.has(2) && vector.has(4), "Le vector ne doit contenir que les chiffres 2 et 4");
});

QUnit.test("Manipulation d'un Vector", function (assert) {
    var vector = new GRA.datastructure.Vector(),
        join,
        toArray;

    vector.add('b', 'a', 'b', 'c', 'd', 'f', 'e');
    vector.reverse();

    assert.equal('e', vector.firstElement(), "Le premier élément doit être la lettre 'e'");
    assert.equal('b', vector.lastElement(), "Le dernier élément doit être la lettre 'b'");

    join = vector.join('');
    assert.equal('efdcbab', join, "La concaténation des éléments doit être égale à 'efdcbab'");

    vector.sortAsc();
    join = vector.join('');
    assert.equal('abbcdef', join, "La concaténation des éléments doit être égale à 'abbcdef'");

    vector.sortDesc();
    join = vector.join('');
    assert.equal('fedcbba', join, "La concaténation des éléments doit être égale à 'fedcbba'");

    toArray = vector.toArray();
    assert.ok(toArray.hasOwnProperty('length'), "Un tableau doit avoir la propriété 'length'");
    assert.ok(toArray.push, "Un tableau doit avoir la propriété 'push'");
    assert.equal(7, toArray.length, "La longueur du tableau doit être égale à 7");
});