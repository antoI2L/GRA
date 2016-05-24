QUnit.module('GRA.utils.StringUtils');

QUnit.test('Test conversion chaîne en numerique', function (assert) {
    var stringUtils = GRA.utils.StringUtils,
        integer = stringUtils.toInt("3"),
        float = stringUtils.toFloat("0.5");

    assert.deepEqual(3, integer, "La chaîne '3' doit être devenue un numérique");
    assert.deepEqual(0.5, float, "La chaîne '0.5' doit être devenue un flottant");
});

QUnit.test('Concaténation de chaînes', function (assert) {
    var stringUtils = GRA.utils.StringUtils,
        concat = stringUtils.concat(['a', 'b', 'test', 'c', 'ok'], ';');

    assert.equal('a;b;test;c;ok', concat, "La chaîne concaténée doit être égale à 'a;b;test;c;ok'");
});

QUnit.test('Transformation des premiers caractères en majuscule', function (assert) {
    var stringUtils = GRA.utils.StringUtils,
        testFirst = stringUtils.ucfirst('test'),
        testAll = stringUtils.ucfirstAll('ceci est un test');

    assert.deepEqual('Test', testFirst, "ucfirst() doit transformer 'test' en 'Test'");
    assert.deepEqual('Ceci Est Un Test', testAll, "ucfirstAll() doit transformer 'ceci est un test' en 'Ceci Est Un Test'");
});

QUnit.test('Remplissage d\'une chaîne', function (assert) {
    var stringUtils = GRA.utils.StringUtils,
        padLeft = stringUtils.padLeft('1234', '0', 8),
        padRight = stringUtils.padRight('0101', '10', 8);

    assert.deepEqual('00001234', padLeft, "Ajout de quatre '0' en début de chaîne");
    assert.deepEqual('01011010', padRight, "Ajout de '1010' en fin de chaîne");
});

QUnit.test('Test contenance de sous-chaînes', function (assert) {
    var stringUtils = GRA.utils.StringUtils,
        contains = stringUtils.has('{id}', '/test/{id}');

    assert.ok(contains, "La chaîne '/test/{id}' doit contenir '{id}'");
});

QUnit.test('Suppression d\'espaces dans une chaîne', function (assert) {
    var stringUtils = GRA.utils.StringUtils,
        trim = stringUtils.fullTrim(' ceci    est un      test    ');

    assert.deepEqual('ceci est un test', trim, "La chaîne ' ceci    est un      test    ' ne doit plus contenir d'espaces excédentaires");
});