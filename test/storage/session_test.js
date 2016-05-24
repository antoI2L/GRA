QUnit.module('GRA.storage.session');

QUnit.test('Initialisation du stockage en session', function (assert) {
    var session = GRA.storage.session;

    session.clear();
    assert.ok(session.isEmpty(), "La session doit être vide");
});

QUnit.test('Stockage de données en session sans durée de vie', function (assert) {
    var session = GRA.storage.session,
        value;

    session.set('qunit/gra/test', 'test');
    assert.notOk(session.isEmpty(), "La session ne doit plus être vide");
    assert.ok(session.has('qunit/gra/test'), "La session doit contenir la clé 'qunit/gra/test'");

    value = session.get('qunit/gra/test');
    assert.equal('test', value, "La valeur doit être égale à 'test'");
    value = session.get('qunit/test', 'default');
    assert.equal('default', value, "La valeur doit être égale à 'default'");

    session.remove('qunit/gra/test');
    assert.ok(session.isEmpty(), "La session doit être vide");
});

QUnit.test('Stockage de données en session avec durée de vie', function (assert) {
    var session = GRA.storage.session,
        value,
        done;

    done = assert.async();
    session.set('qunit/gra/test', 'test', 0.1);
    value = session.get('qunit/gra/test');
    assert.equal('test', value, "La valeur doit être égale à 'test'");

    setTimeout(function () {
        value = session.get('qunit/gra/test', 'default');
        assert.notOk(session.has('qunit/gra/test'), "La session ne doit plus contenir 'qunit/gra/test'");
        assert.equal('default', value, "La valeur doit être égale à 'default'");
        done();
    }, 150);
});