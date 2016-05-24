QUnit.module('GRA.utils.ArrayUtils');

QUnit.test("Vidage d'un tableau", function (assert) {
    var arrayUtils = GRA.utils.ArrayUtils,
        array = [1, 2, 3, 4, 5];

    assert.equal(5, array.length, "Initialement la taille du tableau doit être 5");

    arrayUtils.clear(array);

    assert.equal(0, array.length, "Après clear(), la taille du tableau doit être 0");
});

QUnit.test("Récupération de la position d'un élément", function (assert) {
    var arrayUtils = GRA.utils.ArrayUtils,
        array = ['b', 'd', 'a', 'c', 'e', 'b'];

    assert.equal(0, arrayUtils.indexOf('b', array), "'b' doit se trouver à la position 0");
    assert.equal(2, arrayUtils.indexOf('a', array), "'a' doit se trouver à la position 2");
    assert.equal(4, arrayUtils.indexOf('e', array), "'e' doit se trouver à la position 4");
});

QUnit.test("Test de l'existence d'un élément dans un tableau", function (assert) {
    var arrayUtils = GRA.utils.ArrayUtils,
        array = ['b', 'd', 'a', 'c', 'e', 'b'];

    assert.ok(arrayUtils.inArray('c', array), "'c' doit se trouver dans le tableau");
});

QUnit.test("Test de la méthode forEach", function (assert) {
    var arrayUtils = GRA.utils.ArrayUtils,
        array = [2, 4, 6],
        arrayOfStrings = ['a', 'b', 'c'],
        total = 0,
        concat = '';

    arrayUtils.forEach(array, function (element) {
        total += element;
    });

    assert.equal(12, total, "Le total doit être égal à 12");
    assert.equal(12, arrayUtils.sum(array), "Le total retourné par sum() doit être 12");

    arrayUtils.reverseForEach(arrayOfStrings, function (element) {
        concat += element;
    });

    assert.equal('cba', concat, "La concaténation des éléments du tableau doit se faire de la fin au début");
});