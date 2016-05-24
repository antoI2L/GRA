QUnit.module('GRA.fn.ExecutionQueue');

QUnit.test('Exécution de multiple tâches', function (assert) {
    var executionQueue = new GRA.fn.ExecutionQueue(),
        sum = 0,
        isFinished = false,
        done;

    done = assert.async();
    assert.expect(4);

    executionQueue.add(function (param) {
        sum += 5 + param;

        assert.equal(6, sum, "La somme doit être 6");
    });

    executionQueue.add(function (param) {
        sum += 10 + param;

        assert.equal(17, sum, "La somme doit être 17");
    });

    executionQueue.add(function (param) {
        sum += 15 + param;

        assert.equal(33, sum, "Le somme doit être 33");
    });

    executionQueue.setParameters([1]);

    executionQueue.run(function () {
        isFinished = true;
        assert.ok(isFinished, "Les tâches doivent être toutes terminées");
        done();
    });
});