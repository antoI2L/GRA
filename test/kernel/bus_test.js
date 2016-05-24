QUnit.module('GRA.kernel.Bus');

QUnit.test("Création d'un Bus", function (assert) {
    var bus = new GRA.kernel.Bus();

    assert.equal(0, bus.size(), "La taille du Bus doit être égale à 0 à la création");
});

QUnit.test("Envoi de message à travers le Bus", function (assert) {
    var bus = new GRA.kernel.Bus(),
        appOne = new GRA.kernel.Application('app1'),
        appTwo = new GRA.kernel.Application('app2'),
        isStarted;

    appOne.init(bus, {});
    appTwo.init(bus, {});

    assert.expect(6);
    assert.equal(2, bus.size(), "La taille du Bus doit être égale à 2");

    appOne.on('start', function () {
        var message = new GRA.kernel.Message(1, 'message_app_one');

        isStarted = true;
        message.putString('testOne', 'ok');
        appOne.sendTo('app2', message);
    });

    appOne.on('message', function (message) {
        assert.equal(2, message.getRequestCode(), "Le code du message reçu doit être égal à 2");
        assert.equal(0, message.getInt('result'), "Le résultat reçu doit être 0");
    });

    appTwo.on('message', function (message) {
        var messageTwo = new GRA.kernel.Message(2, 'message_app_two');

        assert.equal(1, message.getRequestCode(), "Le code du message reçu doit être égal à 1");
        assert.equal('ok', message.getString('testOne'), "La chaîne reçue doit être égale à 'ok'");

        messageTwo.putInt('result', 0);
        appTwo.sendTo('app1', messageTwo);
    });

    appOne.dispatch('start');
    assert.ok(isStarted, "L'application 1 a doit être démarrée");
});