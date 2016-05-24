QUnit.module('GRA.storage.local');

QUnit.test('Initialisation du stockage en local', function (assert) {
    var local = GRA.storage.local;

    local.clear();
    assert.ok(local.isEmpty(), "La local doit être vide");
});

QUnit.test('Stockage de données en local sans durée de vie', function (assert) {
    var local = GRA.storage.local,
        value;

    local.set('qunit/gra/test', 'test');
    assert.notOk(local.isEmpty(), "La local ne doit plus être vide");
    assert.ok(local.has('qunit/gra/test'), "La local doit contenir la clé 'qunit/gra/test'");

    value = local.get('qunit/gra/test');
    assert.equal('test', value, "La valeur doit être égale à 'test'");
    value = local.get('qunit/test', 'default');
    assert.equal('default', value, "La valeur doit être égale à 'default'");

    local.remove('qunit/gra/test');
    assert.ok(local.isEmpty(), "La local doit être vide");
});

QUnit.test('Stockage de données en local avec durée de vie', function (assert) {
    var local = GRA.storage.local,
        value,
        done;

    done = assert.async();
    local.set('qunit/gra/test', 'test', 0.1);
    value = local.get('qunit/gra/test');
    assert.equal('test', value, "La valeur doit être égale à 'test'");

    setTimeout(function () {
        value = local.get('qunit/gra/test', 'default');
        assert.notOk(local.has('qunit/gra/test'), "La local ne doit plus contenir 'qunit/gra/test'");
        assert.equal('default', value, "La valeur doit être égale à 'default'");
        done();
    }, 150);
});