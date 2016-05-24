QUnit.module('GRA.datastructure.Map');

QUnit.test('Création d\'une Map', function (assert) {
    var map = new GRA.datastructure.Map();

    assert.ok(map.isEmpty(), "La map doit être vide à la création");
    assert.equal(0, map.size(), "La taille de la Map doit être 0");
    assert.equal('{}', map.toString(), "La Map en chaîne de caractère doit être '{}'");
});

QUnit.test("Ajout d'éléments dans une Map", function (assert) {
    var map = new GRA.datastructure.Map();

    map.put('a', 'aaaa');
    map.put('b', 'bbbb');

    assert.notOk(map.isEmpty(), "La map ne doit pas être vide");
    assert.equal(2, map.size(), "La taille de la Map doit être 2");
    assert.equal('{"a":"aaaa","b":"bbbb"}', map.toString(), "La Map en chaîne de caractère doit être '{\"a\":\"aaaa\",\"b\":\"bbbb\"}'");
    assert.ok(map.containsKey('a'), "La map doit contenir la clé 'a'");
    assert.ok(map.containsKey('b'), "La map doit contenir la clé 'b'");
    assert.ok(map.containsValue('aaaa'), "La map doit contenir la valeur 'aaaa'");
    assert.ok(map.containsValue('bbbb'), "La map doit contenir la valeur 'bbbb'");
});

QUnit.test("Ajout multiple d'éléments dans une Map", function (assert) {
    var map = new GRA.datastructure.Map();

    map.putAll([
        ['a', 'aaaa'],
        ['b', 'bbbb']
    ]);

    assert.notOk(map.isEmpty(), "La map ne doit pas être vide");
    assert.equal(2, map.size(), "La taille de la Map doit être 2");
    assert.equal('{"a":"aaaa","b":"bbbb"}', map.toString(), "La Map en chaîne de caractère doit être '{\"a\":\"aaaa\",\"b\":\"bbbb\"}'");
    assert.ok(map.containsKey('a'), "La map doit contenir la clé 'a'");
    assert.ok(map.containsKey('b'), "La map doit contenir la clé 'b'");
    assert.ok(map.containsValue('aaaa'), "La map doit contenir la valeur 'aaaa'");
    assert.ok(map.containsValue('bbbb'), "La map doit contenir la valeur 'bbbb'");
});

QUnit.test("Récupération d'éléments d'une Map", function (assert) {
    var map = new GRA.datastructure.Map();

    map.put('a', 'aaaa');
    map.put('b', 'bbbb');
    map.put('c', 'cccc');

    assert.deepEqual('aaaa', map.get('a'), "La clé 'a' doit contenir la valeur 'aaaa'");
    assert.deepEqual('bbbb', map.get('b'), "La clé 'b' doit contenir la valeur 'bbbb'");
    assert.deepEqual('cccc', map.get('c'), "La clé 'c' doit contenir la valeur 'cccc'");
});

QUnit.test("Suppression d'éléments dans une Map", function (assert) {
    var map = new GRA.datastructure.Map();

    map.put('a', 'aaaa');
    map.put('b', 'bbbb');
    map.put('c', 'cccc');
    map.put('d', 'dddd');

    assert.equal(4, map.size(), "La taille de la Map doit être égale à 4");

    map.remove('c');
    map.remove('a');

    assert.equal(2, map.size(), "La taille de la Map doit être égale à 2 après suppression");

    assert.notOk(map.containsKey('a'), "La Map ne doit plus contenir la clé 'a'");
    assert.notOk(map.containsKey('c'), "La Map ne doit plus contenir la clé 'c'");

    map.clear();

    assert.ok(map.isEmpty(), "La Map doit être vide après appel à la méthode clear()");
    assert.equal(0, map.size(), "La taille de la Map doit être égale à 0");
});