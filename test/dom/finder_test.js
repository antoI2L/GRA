QUnit.module('GRA.dom.Finder');

QUnit.test('Ajouter et Compter des éléments', function (assert) {
    var dom = new GRA.dom.Finder();

    dom.findById('qunit-fixture').append('<ul><li></li><li></li></ul>');
    assert.equal(1, dom.count('ul'), "Il doit y avoir 1 <ul>");
    assert.equal(2, dom.count('li'), "Il doit y avoir 2 <li>");
});

QUnit.test('Ajout et retrait de classe', function (assert) {
    var dom = new GRA.dom.Finder();

    dom.findById('qunit-fixture').append('<span></span>').findOne('span').addClass('test');

    assert.ok(dom.hasClass('test'), "Le span doit avoir la classe 'test'");

    dom.removeClass('test');

    assert.notOk(dom.hasClass('test'), "Le span ne doit plus avoir la classe 'test'");
});

QUnit.test('Suppression d\'éléments', function (assert) {
    var dom = new GRA.dom.Finder();

    dom.findById('qunit-fixture').append('<span class="removable"></span><span class="not-removable"></span>');

    assert.equal(2, dom.count('span'), "Il doit y avoir 2 <span>");
    assert.equal(1, dom.countByClass('removable'), "Il doit y avoir 1 <span class='removable'>");

    dom.findByClass('removable').remove();
    dom.findById('qunit-fixture');

    assert.equal(1, dom.count('span'), "Il doit y avoir 1 <span>");
    assert.equal(0, dom.countByClass('removable'), "Il doit y avoir 0 <span class='removable'>");
});