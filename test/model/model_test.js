QUnit.module('GRA.model.Model');

QUnit.test("Création d'un nouveau Model", function (assert) {
    var test = new GRA.model.Model('test');

    test.defineBy({
        attrOne: 'test1',
        attrTwo: 10,
        attrThree: true
    });

    assert.equal('test1', test.attribute('attrOne'), "attrOne doit être égal à 'test1'");
    assert.deepEqual(10, test.attribute('attrTwo'), "attrTwo doit être égal à 10");
    assert.deepEqual(true, test.attribute('attrThree'), "attrThree doit être égal à true");
});

QUnit.test("Modification des attributs d'un Model", function (assert) {
    var test = new GRA.model.Model('test');

    test.defineBy({
        attrOne: 'test1'
    });

    test
        .attribute('attrOne', 'test2')
        .attribute('attrTwo', 5);

    assert.deepEqual('test2', test.attribute('attrOne'), "attrOne doit être égal à 'test2'");
    assert.deepEqual(5, test.attribute('attrTwo'), "attrTwo doit être égal à 5");
});

QUnit.test("Gestion des événements d'un Model", function (assert) {
    var test = new GRA.model.Model('test'),
        result;

    test.on('test', function () {
        result = true;
    });

    assert.notOk(result, "Le résultat ne doit pas être OK avant le déclenchement de l'événement");

    test.dispatch('test');

    assert.ok(result, "Le résultat doit être OK après le déclenchement de l'événement");
});

QUnit.test("Stockage d'un Model en local", function (assert) {
    var test = new GRA.model.Model('test'),
        local = GRA.storage.local,
        toString;

    test.defineBy({
        attrOne: 'test1'
    });

    toString = test.toString();
    assert.equal('{"name":"test","attributes":{"attrOne":"test1"}}', toString, "Le Model en chaîne de caractères doit être OK");

    test.persist();
    assert.notOk(local.isEmpty(), "Le stockage local ne doit pas être vide");
    assert.ok(local.has('model/test'), "Le stockage local doit contenir la clé 'model/test'");
});

QUnit.test("Retrouver un Model stocké en local", function (assert) {
    var test = new GRA.model.Model('test'),
        local = GRA.storage.local;

    test.defineBy({
        attrOne: null
    });

    assert.ok(local.has('model/test'), "Le stockage local doit contenir la clé 'model/test'");

    test.retrieve();

    assert.equal('test1', test.attribute('attrOne'), "attrOne doit être égal à 'test1'");
    test.clear();

    assert.notOk(local.has('model/test'), "Le stockage local ne doit plus contenir 'model/test'");
});