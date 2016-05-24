(function (GRA) {

    GRA.fn = GRA.fn || {};

    /**
     *
     * @constructor
     */
    GRA.fn.ExecutionQueue = function ExecutionQueue() {
        var tasks = new GRA.datastructure.Queue(),
            parameters = [];

        /**
         * Permet d'ajouter une tâche à la file d'exécution
         *
         * @param {function} task Tâche (fonction)
         */
        this.add = function add(task) {
            tasks.enqueue(task);
        };

        /**
         * Permet de d'exécuter la file d'exécution
         *
         * @param {function} callback Fonction à exécuter à la fin des tâches
         */
        this.run = function run(callback) {
            var queue = tasks.clone();

            setTimeout(function () {
                var task = queue.dequeue();
                task.apply(null, parameters);

                if (0 < queue.size()) {
                    setTimeout(arguments.callee, 5);
                } else {
                    callback();
                }
            }, 5);
        };

        /**
         * Permet de spécifier la liste des paramètres à passer à chaque tâche
         *
         * @param {Array} params Liste des paramètres
         */
        this.setParameters = function setParameters(params) {
            parameters = params;
        };

        /**
         * Permet d'ajouter une liste de tâches à la file d'exécution
         *
         * @param {Array} arrayOfTasks Liste des tâches (fonctions)
         */
        this.setTasks = function setTasks(arrayOfTasks) {
            var index,
                length = arrayOfTasks.length;

            for (index = 0; index < length; index += 1) {
                tasks.enqueue(arrayOfTasks[index]);
            }
        };
    };
    
}(GRA || {}));