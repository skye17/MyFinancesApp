(function () {
    function createTask(name) {
        return {
            name: name,
            status: 'todo'
        }
    }

    var tasks = [createTask('Купить хлеб'), createTask('Позвонить в сервис')],
        listElement,
        newTaskInput,
        selectedFilterElement,
        currentFilter = null,
        statistic = {
            total: 0,
            done: 0,
            left: 0
        };

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
        selectedFilterElement = document.getElementsByClassName('filter__item_selected')[0];
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

            doFiltration();
        });

        document.getElementsByClassName('filters__item_all')[0].addEventListener('click', function () {
            toggleFilter(event.currentTarget);
            updateFilter(null);
        });

        document.getElementsByClassName('filters__item_done')[0].addEventListener('click', function (event) {
            toggleFilter(event.currentTarget);
            updateFilter('done');
        });

        document.getElementsByClassName('filters__item_left')[0].addEventListener('click', function (event) {
            toggleFilter(event.currentTarget);
            updateFilter('todo');
        });
    }

    function toggleFilter(newFilterElement) {
        // Если фильтр уже выбран - ничего не делаем.
        if (selectedFilterElement === newFilterElement) {
            return;
        }

        // Убираем рамку у предыдущего фильтра.
        selectedFilterElement.classList.toggle('filter__item_selected');

        // Добавляем рамку выбранному фильтру.
        newFilterElement.classList.toggle('filter__item_selected');

        // Запоминаем выбранный фильтр.
        selectedFilterElement = newFilterElement;
    }

    function updateFilter(filter) {
        currentFilter = filter;
        doFiltration();
    }

    function doFiltration() {
        Array.prototype.forEach.call(listElement.children, function (taskElement) {
            if (currentFilter === null) {
                taskElement.style.display = 'block';
            } else if (currentFilter === 'todo' && taskElement.classList.contains('task_todo')) {
                taskElement.style.display = 'block';
            } else if (currentFilter === 'done' && taskElement.classList.contains('task_done')) {
                taskElement.style.display = 'block';
            } else {
                taskElement.style.display = 'none';
            }
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

            // Обновляем счетчики статистики.
            statistic.left--;
            statistic.done++;
        } else {
            taskElement.className = taskElement.className.replace('task_done', 'task_todo');

            // Обновляем счетчики статистики.
            statistic.left++;
            statistic.done--;
        }

        renderStatistic();
        doFiltration();
    }
    
    function isDeleteButton(element) {
        return element.className.indexOf('task__delete-button') !== -1;
    }


    function getTaskByDeleteButton(deleteButton) {
        return deleteButton.parentElement;
    }

    function deleteTask(taskElement) {
        taskElement.parentElement.removeChild(taskElement);

        // Обновляем статистику.
        if (taskElement.classList.contains('task_done')) {
            statistic.done--;
        } else {
            statistic.left--;
        }
        renderStatistic();
    }

    function renderTaskList() {
        tasks.forEach(task => {
            listElement.appendChild(createTaskElement(task.name));
        });
    }

    function renderStatistic() {
        // Получаем DOM элементы, текст которых нужно обновить.
        var totalElement = document.getElementsByClassName('statistic__total')[0];
        var doneElement = document.getElementsByClassName('statistic__done')[0];
        var leftElement = document.getElementsByClassName('statistic__left')[0];

        // Обновляем элементы.
        totalElement.innerText = statistic.total;
        doneElement.innerText = statistic.done;
        leftElement.innerText = statistic.left;
    }

    function createTaskElement(name) {
        // Создаем вспомогательный элмент div.
        var task = document.createElement('div');
        task.innerHTML = `<div class="list__item task task_todo">
                                <div class="task__status task__status_todo"></div>
                                <span class="task__name">${name}</span>
                                <div class="task__delete-button">❌</div>
                            </div>`;

        // Обновляем статистику.
        statistic.left++;
        renderStatistic();

        // Вовзращаем динамически созданный элемент.
        return task.firstChild;
    }

    function isEmptyString(str) {
        return /^\s*$/.test(str);
    }
})();

