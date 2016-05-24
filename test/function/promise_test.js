QUnit.module('GRA.fn.Promise');

QUnit.test("Exécution asynchrone d'une promesse", function (assert) {
    var promise,
        done;

    done = assert.async();
    assert.expect(2);

    promise = new GRA.fn.Promise(function (resolve) {
        setTimeout(function () {
            resolve(0);
        }, 5);

    });

    promise.then(function (value) {
        assert.equal(0, value, "La valeur doit être 0");

        return new GRA.fn.Promise(function (resolve) {
            setTimeout(function () {
                resolve(5);
            }, 5);
        });
    }).then(function (value) {
        assert.equal(5, value, "La valeur doit être 5");
        done();
    });
});

QUnit.test("Gestion des erreurs d'une promesse", function (assert) {
    var promise,
        done;

    done = assert.async();
    assert.expect(1);

    promise = new GRA.fn.Promise(function (resolve) {
        setTimeout(function () {
            resolve('<p>Test</p>');
        }, 5);
    });

    promise.then(function (json) {
        JSON.parse(json);
    }).fail(function (error) {
        assert.ok(true, "La méthode fail doit être appliquée.");
        done();
    });
});