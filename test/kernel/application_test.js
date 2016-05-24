QUnit.module('GRA.kernel.Application');

QUnit.test("Création d'une application", function (assert) {
    var application = new GRA.kernel.Application('app_test');

    assert.equal('app_test', application.getName(), "Le nom de l'application doit être 'app_test'");
    assert.ok(application.hasOwnProperty('uid'), "L'applcation doit posséder une propriété 'uid'");
});

QUnit.test("Gestion des événements d'une application", function (assert) {
    var application = new GRA.kernel.Application('app_test'),
        resultEventOne,
        resultEventTwo;

    application.on('test.one', function () {
        resultEventOne = true;
    });

    application.on('test.two', function () {
        resultEventTwo = true;
    });

    application.dispatch('test.one');

    assert.ok(resultEventOne, "L'événement 1 doit être déclenché");
    assert.notOk(resultEventTwo, "L'événement 2 ne doit pas être encore déclenché");

    application.dispatch('test.two');

    assert.ok(resultEventTwo, "L'événement 2 doit être déclenché");
});