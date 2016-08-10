(function () {
    function createTask(name) {
        return {
            name: name,
            status: 'todo'
        }
    }

    var tasks = [createTask('Купить хлеб'), createTask('Позвонить в сервис')];

    renderTaskList();

    function renderTaskList() {
        var listElement = document.getElementsByClassName('list')[0];
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
})();

