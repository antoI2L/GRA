QUnit.module('GRA.kernel.Kernel');

QUnit.test('Instanciation du noyau', function (assert) {
    assert.notOk(GRA.kernel.Kernel.isDebug(), "Le noyau doit être instancié en mode NON debug");
});

QUnit.test('Changement du mode de debug', function (assert) {
    var kernel = GRA.kernel.Kernel;

    kernel.setDebug(true);
    assert.ok(kernel.isDebug(), "Le noyau doit maintenant être en mode debug");
    kernel.setDebug(false);
    assert.notOk(kernel.isDebug(), "Le noyau doit maintenant être en mode non debug");
});

QUnit.test('Boot d\'une application', function (assert) {
    var kernel = GRA.kernel.Kernel,
        isBooted;

    kernel.boot(function () {
        var application = new GRA.kernel.Application('app1');

        application.on('boot', function () {
            isBooted = true;
        });

        return application;
    });

    assert.ok(kernel.isBooted('app1'), "L'application 'app1' doit avoir été bootée au sein du noyau");
    assert.ok(isBooted, "L'application doit avoir déclenché l'événement 'boot'");
    assert.notOk(kernel.isStarted('app1'), "L'application 'app1' ne doit pas être démarrée");
});

QUnit.test('Démarrage d\'une application', function (assert) {
    var kernel = GRA.kernel.Kernel,
        isStarted;

    kernel.boot(function () {
        var application = new GRA.kernel.Application('app1');

        application.on('start', function () {
            isStarted = true;
        });

        return application;
    });

    kernel.start('app1');
    assert.ok(kernel.isStarted('app1'), "L'application 'app1' doit être démarrée");
    assert.ok(isStarted, "L'application 'app1' doit avoir déclenché l'événement 'start'");
});

QUnit.test('Arrêt d\'une application', function (assert) {
    var kernel = GRA.kernel.Kernel,
        isStarted = false,
        isStopped = true;

    kernel.boot(function () {
        var application = new GRA.kernel.Application('app1');

        application.on('start', function () {
            isStarted = true;
            isStopped = false;
        });

        application.on('stop', function () {
            isStarted = false;
            isStopped = true;
        });

        return application;
    });

    kernel.start('app1');
    assert.notOk(isStopped, "L'application 'app1' doit avoir déclenché l'événement 'start' (1)");
    assert.ok(isStarted, "L'application 'app1' doit avoir déclenché l'événement 'start' (2)");

    kernel.stop('app1');
    assert.notOk(kernel.isStarted('app1'), "L'application  ne doit plus être en marche");
    assert.ok(isStopped, "L'application 'app1' doit avoir déclenché l'événement 'stop' (1)");
    assert.notOk(isStarted, "L'application 'app1' doit avoir déclenché l'événement 'stop' (2)");
});