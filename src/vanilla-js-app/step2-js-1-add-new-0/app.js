(function () {
    function createTask(name) {
        return {
            name: name,
            status: 'todo'
        }
    }

    var tasks = [createTask('Купить хлеб'), createTask('Позвонить в сервис')],
        listElement,
        newTaskInput;


    document.addEventListener('DOMContentLoaded', function () {
        initialize();
    });

    function initialize() {
        initializeElements();
        renderTaskList();
        addSubscribers()
    }

    function initializeElements() {
        listElement = document.getElementsByClassName('list')[0];
        newTaskInput = document.getElementsByClassName('add-task__input')[0];
    }

    function addSubscribers() {
        newTaskInput.addEventListener('keypress', function (event) {
            if (event.keyCode !== 13) {
                return;
            }

            var name = newTaskInput.value;

            if (isEmptyString(name)) {
                return;
            }

            listElement.insertBefore(createTaskElement(name), listElement.firstChild);

            newTaskInput.value = '';
        });
    }

    function renderTaskList() {
        tasks.forEach(task => {
            listElement.appendChild(createTaskElement(task.name));
        });
    }

    function createTaskElement(name) {
        // Создаем вспомогательный элмент div.
        var task = document.createElement('div');
        task.innerHTML = `<div class="list__item task task_todo">
                                <div class="task__status task__status_todo"></div>
                                <span class="task__name">${name}</span>
                                <div class="task__delete-button">❌</div>
                            </div>`;

        // Вовзращаем динамически созданный элемент.
        return task.firstChild;
    }

    function isEmptyString(str) {
        return /^\s*$/.test(str);
    }
})();

