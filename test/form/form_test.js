QUnit.module('GRA.form.Form');

QUnit.test("Ajout d'un champ texte et d'une liste déroulante à un formulaire", function (assert) {
    var fixture = $('#qunit-fixture'),
        form = new GRA.form.Form();

    fixture.append('<input type="text" id="field-1" />');
    fixture.append('<select id="field-2"><option></option><option>Test</option></select>');

    form.validator.addRule('not.empty', function (value) {
        return '' !== value;
    }, "non-vide");

    form.addInput('a', '#field-1', ['not.empty']);
    form.addSelect('b', '#field-2', '');

    assert.notOk(form.isValid(), "Le formulaire ne doit pas être valide");

    $('#field-1').val('a').trigger('keyup');
    $('#field-2').val('Test').trigger('change');

    assert.ok(form.isValid(), "Le formulaire doit être valide");
    assert.notOk(form.validator.hasErrors(), "Le Validator du formulaire ne doit pas contenir d'erreur");

    $('#field-1').val('').trigger('keyup');
    assert.notOk(form.isValid(), "Le formulaire ne doit pas être valide");
    assert.ok(form.validator.hasErrors(), "Le Validator du formulaire doit contenir une erreur");
    assert.equal("non-vide", form.validator.getErrors().pop(), "Le message d'erreur doit correspondre");
});

QUnit.test("Lier un Model à un formulaire", function (assert) {
    var fixture = $('#qunit-fixture'),
        model = new GRA.model.Model('formulaire'),
        form = new GRA.form.Form();

    model.defineBy({
        'a': '',
        'b': ''
    });

    fixture.append('<input type="text" id="field-1" />');
    fixture.append('<select id="field-2"><option></option><option>Test</option></select>');

    form.validator.addRule('not.empty', function (value) {
        return '' !== value;
    }, "non-vide");

    form.on('input.valid', function (input) {
        $(input).removeClass('error').addClass('success');
    });

    form.on('input.invalid', function (input) {
        $(input).removeClass('success').addClass('error');
        $(input).data('error', form.validator.getErrors().pop());
    });

    form.on('select.valid', function (select) {
        $(select).removeClass('error').addClass('success');
    });

    form.on('select.invalid', function (select) {
        $(select).removeClass('success').addClass('error');
    });

    form.addInput('a', '#field-1', ['not.empty']);
    form.addSelect('b', '#field-2', '');
    form.setModel(model);

    model.attribute('a', 'test');
    model.attribute('b', 'Test');

    assert.equal('test', $('#field-1').val(), "Le champ texte doit contenir 'test'");
    assert.ok($('#field-1').hasClass('success'), "Le champ texte doit avoir la classe 'success'");
    assert.equal('Test', $('#field-2').val(), "La liste déroulante doit contenir 'Test'");
    assert.ok($('#field-2').hasClass('success'), "La liste déroulante doit avoir la classe 'success'");
    assert.ok(form.isValid(), "Le formulaire doit être valide");
    assert.notOk(form.validator.hasErrors(), "Le Validator du formulaire ne doit pas contenir d'erreur");

    model.attribute('a', '');
    assert.equal('', $('#field-1').val(), "Le champ texte doit contenir ''");
    assert.ok($('#field-1').hasClass('error'), "Le champ texte doit avoir la classe 'error'");
    assert.equal("non-vide", $('#field-1').data('error'), "Le champ texte doit avoir la bonne erreur");
    assert.notOk(form.isValid(), "Le formulaire ne doit pas être valide");

    model.attribute('a', 'ok');
    model.attribute('b', '');

    assert.ok($('#field-2').hasClass('error'), "La liste déroulante doit avoir la classe 'error'");
    assert.notOk(form.isValid(), "Le formulaire ne doit pas être valide");
    assert.notOk(form.validator.hasErrors(), "Le Validator du formulaire ne doit pas contenir d'erreur");

    model.attribute('b', 'Test');
    assert.ok(form.isValid(), "Le formulaire doit être valide");
    assert.notOk(form.validator.hasErrors(), "Le Validator du formulaire ne doit pas contenir d'erreur");
});