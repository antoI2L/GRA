QUnit.module('GRA.form.Validator');

QUnit.test("Validation de valeurs", function (assert) {
    var validator = new GRA.form.Validator();

    assert.notOk(validator.hasErrors(), "Le Validator ne doit pas contenir d'erreur à la création");

    validator.addRule('not.empty', function (value) {
        return '' !== value;
    }, "Ce champ ne doit pas être vide.");

    validator.addRule('numeric', function (value) {
        return GRA.utils.is.numeric(value);
    }, "Ce champ doit être un nombre.");

    validator.validate('', ['not.empty']);

    assert.ok(validator.hasErrors(), "La Validator doit contenir une erreur");
    assert.equal("Ce champ ne doit pas être vide.", validator.getErrors().pop(), "Le message d'erreur doit correspondre");

    assert.notOk(validator.hasErrors(), "Le Validator ne doit pas contenir d'erreur après la gestion des erreurs");

    assert.ok(validator.validate('23', ['not.empty', 'numeric']), "La valeur doit être validée");
});