QUnit.module('GRA.datastructure.Stack');

QUnit.test("Création d'une pile", function (assert) {
    var stack = new GRA.datastructure.Stack();

    assert.ok(stack.isEmpty(), "La file doit être vide");
    assert.equal(0, stack.size(), "La taille de la pile doit être 0");
});

QUnit.test("Ajout d'éléments dans une pile", function (assert) {
    var stack = new GRA.datastructure.Stack();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    assert.notOk(stack.isEmpty(), "La pile ne doit plus être vide");
    assert.equal(3, stack.size(), "La taille de la pile doit être 3");
    assert.equal(3, stack.top(), "La tête de la pile doit être 3");
});

QUnit.test("Suppression d'éléments dans une pile", function (assert) {
    var stack = new GRA.datastructure.Stack(),
        top;

    stack.push(1);
    stack.push(2);
    stack.push(3);

    top = stack.pop();
    assert.equal(2, stack.size(), "La taille de la pile doit être 2");
    assert.equal(3, top, "L'élément dépilé doit être 3");

    top = stack.pop();
    assert.equal(1, stack.size(), "La taille de la pile doit être 1");
    assert.equal(2, top, "L'élément dépilé doit être 2");

    top = stack.pop();
    assert.equal(0, stack.size(), "La taille de la pile doit être 0");
    assert.equal(1, top, "L'élément dépilé doit être 1");
});