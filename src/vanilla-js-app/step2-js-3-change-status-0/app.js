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
        listElement.addEventListener('click', function (event) {
            var element = event.target,
                taskElement;

            if (isStatus(element)) {
                taskElement = getTaskByStatusElement(element);
                changeStatus(taskElement);
                return;
            }

            if (isDeleteButton(element)) {
                taskElement = getTaskByDeleteButton(element);
                deleteTask(taskElement);
            }
        });

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

    function isStatus(element) {
        return element.className.indexOf('task__status') !== -1;
    }

    function getTaskByStatusElement(statusElement) {
        return statusElement.parentElement;
    }

    function changeStatus(taskElement) {
        if (taskElement.className.indexOf('task_todo') !== -1) {
            taskElement.className = taskElement.className.replace('task_todo', 'task_done');
        } else {
            taskElement.className = taskElement.className.replace('task_done', 'task_todo');
        }
    }

    function isDeleteButton(element) {
        return element.className.indexOf('task__delete-button') !== -1;
    }


    function getTaskByDeleteButton(deleteButton) {
        return deleteButton.parentElement;
    }

    function deleteTask(taskElement) {
        taskElement.parentElement.removeChild(taskElement);
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

