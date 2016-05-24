QUnit.module('GRA.kernel.Message');

QUnit.test("Création d'un Message", function (assert) {
    var message = new GRA.kernel.Message(1, 'desc');

    assert.equal(1, message.getRequestCode(), "Le code de la requête doit être égal à 1");
    assert.equal('desc', message.getDescription(), "La description du message doit être 'desc'");
    assert.notOk(isNaN(message.getId()), "L'id du message doit être un numérique");
});

QUnit.test("Ajout de données dans un Message", function (assert) {
    var message = new GRA.kernel.Message(1, 'desc'),
        obj,
        result;

    message.putInt('code', 1234);
    message.putString('name', 'message');
    message.putObject('obj', {
        name: 'test',
        fct: function fct() {
            result = true;
        }
    });

    assert.equal(1234, message.getInt('code'), "Le code doit être 1234");
    assert.equal('message', message.getString('name'), "Le nom doit être 'message'");

    obj = message.getObject('obj');

    assert.ok(obj.hasOwnProperty('fct'), "obj doit avoir la propriété 'fct'");

    obj.fct();

    assert.equal('test', obj.name, "obj.name doit être égal à 'test'");
    assert.ok(result, "obj.fct() doit avoir passé result à TRUE");
});