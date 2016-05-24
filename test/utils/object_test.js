QUnit.module('GRA.utils.ObjectUtils');

QUnit.test("Informations d'un objet", function (assert) {
    var objectUtils = GRA.utils.ObjectUtils,
        obj = {
            'a': 'aaaa',
            'b': 'bbbb',
            'c': 'cccc'
        };

    assert.equal(3, objectUtils.countProperties(obj), "L'objet doit contenir 3 propriétés");
    assert.ok(objectUtils.own('b', obj), "L'objet doit contenir la propriété 'b'");
    assert.equal('{"a":"aaaa","b":"bbbb","c":"cccc"}', objectUtils.stringify(obj), "Transformation en JSON");
});

QUnit.test("Informations d'une fonction", function (assert) {
    var objectUtils = GRA.utils.ObjectUtils,
        anonymous = function () {},
        named = function test() {},
        klass = new named();

    assert.ok(objectUtils.isAnonymous(anonymous), "La fonction doit être anonyme");
    assert.equal('test', objectUtils.getFunctionName(named), "La fonction doit se nommer 'test'");
    assert.equal('test', objectUtils.getClassName(klass), "Le nom de la classe doit être 'test'");
});

QUnit.test("Fusion et extension de propriétés entre objet", function (assert) {
    var objectUtils = GRA.utils.ObjectUtils,
        objA = {'b': 'bbbb'},
        objB = {'a': 'aaaa', 'fct': function test() {}},
        objC = {'b': 'cccc'};

    objectUtils.merge(objA, objC);

    assert.equal('cccc', objA.b, "La propriété 'b' de l'objet A doit contenir 'cccc'");

    objectUtils.extend(objA, objB);

    assert.ok(objA.hasOwnProperty('a'), "L'objet A doit contenir la propriété 'a'");
    assert.ok(objA.hasOwnProperty('fct'), "L'objet A doit contenir la propriété 'fct'");
    assert.equal('test', objectUtils.getFunctionName(objA.fct), "La propriété 'fct' de l'objet A doit contenir une fonction dont le nom est 'test'");
});