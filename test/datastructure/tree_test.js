QUnit.module('GRA.datastructure.BinarySearchTree');

QUnit.test("Création d'un arbre binaire de recherche", function (assert) {
    var tree = new GRA.datastructure.BinarySearchTree();

    assert.ok(tree.isEmpty(), "l'arbre doit être vide à sa création");

    tree.add('r', 'root')
        .add('a', 'aaaa')
        .add('az', 'azaz')
        .add('aze', 'azeaze')
        .add('azb', 'azbazb')
        .add('azd', 'azdazd')
        .add('b', 'bbbb')
        .add('s', 'ssss')
        .add('se', 'sese')
        .add('sb', 'sbsb')
        .add('sc', 'scsc');

    assert.notOk(tree.isEmpty(), "L'arbre ne doit plus être vide.");
    assert.equal(11, tree.countNodes(), "L'arbre doit contenir 11 noeuds");
});

QUnit.test("Recherche d'éléments dans un arbre binaire de recherche", function (assert) {
    var tree = new GRA.datastructure.BinarySearchTree(),
        value,
        iterations;

    assert.ok(tree.isEmpty(), "l'arbre doit être vide à sa création");

    tree.add('r', 'root')
        .add('a', 'aaaa')
        .add('az', 'azaz')
        .add('aze', 'azeaze')
        .add('azb', 'azbazb')
        .add('azd', 'azdazd')
        .add('b', 'bbbb')
        .add('s', 'ssss')
        .add('se', 'sese')
        .add('sb', 'sbsb')
        .add('sc', 'scsc');

    value = tree.search('r', tree.DEPTH_FIRST);
    iterations = tree.countIterations();
    assert.equal('root', value, "La valeur doit être 'root' pour la clé 'r'");
    assert.equal(1, iterations, "1 itération doit être nécessaire pour retrouver 'root'");

    value = tree.search('azb', tree.DEPTH_FIRST);
    iterations = tree.countIterations();
    assert.equal('azbazb', value, "La valeur doit être 'azbazb' pour la clé 'azb'");
    assert.equal(5, iterations, "5 itérations doivent être nécessaires pour retrouver 'azbazb'");

    value = tree.search('sc', tree.DEPTH_FIRST);
    iterations = tree.countIterations();
    assert.equal('scsc', value, "La valeur doit être 'scsc' pour la clé 'sc'");
    assert.equal(5, iterations, "5 itérations doivent être nécessaires pour retrouver 'scsc'");

    value = tree.search('b', tree.DEPTH_FIRST);
    iterations = tree.countIterations();
    assert.equal('bbbb', value, "La valeur doit être 'bbbb' pour la clé 'b'");
    assert.equal(5, iterations, "5 itérations doivent être nécessaires pour retrouver 'bbbb'");
});