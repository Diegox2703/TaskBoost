const toDoListCreatorButton = document.querySelectorAll(".to-do-list-creator-button");

function openToDoList (toDoListClass, content, key) {  
    
    let data = content;
    
    //// Open Window /////////////////////////////

    document.body.style.overflow="hidden";

    const toDoList = document.querySelector(`.${toDoListClass}`);
    
    if (key) {
        toDoList.dataset.key=key;
    }

    document.querySelector(".to-do-list-window-background").style.display="flex";
    toDoList.style.display="flex";
    toDoList.dataset.selected="true";

    document.querySelector(".to-do-list-window-background").style.animation="0.3s forwards openWindowAnimation";
    toDoList.style.animation="0.3s forwards openWindowFade";

    // Buttons Header ////////////////////////////

    const returnButton = toDoList.querySelector(".return-button");
    const tagWindowButton = toDoList.querySelector(".tag-window-button");
    const reminderWindowButton = toDoList.querySelector(".reminder-button-window");
    const deleteWindowButton = toDoList.querySelector(".delete-button-window");
    returnButton.classList.add("return-button");

    returnButton.addEventListener("click",saveData);

    tagWindowButton.addEventListener("click",openTagWindow);

    reminderWindowButton.addEventListener("click",openReminder);

    deleteWindowButton.addEventListener("click",deleteToDoListContent)

    ///// Content ////////////////////////////

    if (toDoListClass === "checkbox-tasks-window") {

        localStorage.setItem("taskKey",0)

        const CheckboxTitle = toDoList.querySelector(".editable-to-do-list-title");
        const addNewTaskButton = document.querySelector(".add-new-task-button");
        const numberOfCompletedTasks = document.querySelector(".number-of-completed-tasks-window-container");
        
        CheckboxTitle.addEventListener("paste",()=>CheckboxTitle.contentEditable="plaintext-only");

        CheckboxTitle.addEventListener("input",()=>CheckboxTitle.contentEditable=true);

        addNewTaskButton.addEventListener("click",createUncompletedCheckboxTask);
    
        numberOfCompletedTasks.addEventListener("click",numberOfCompletedTasksButton);

        if (data) {

            CheckboxTitle.innerHTML = data.title;
            data.uncompletedTasks.forEach(task=>createUncompletedCheckboxTask(task));
            data.completedTasks.forEach(task=>createCompletedCheckboxTask(task));

        }

    } else if (toDoListClass === "note-window") {

        const noteTitle = toDoList.querySelector(".editable-to-do-list-title");
        const note = toDoList.querySelector(".editable-note-text");

        noteTitle.addEventListener("paste",()=>noteTitle.contentEditable="plaintext-only");
        noteTitle.addEventListener("input",()=>noteTitle.contentEditable=true);

        note.addEventListener("paste",()=>note.contentEditable="plaintext-only");
        note.addEventListener("input",()=>note.contentEditable=true);

        if (data) {

            noteTitle.innerHTML = data.title;
            note.innerHTML = data.note;

        }

    } else {

        const singleTask = toDoList.querySelector(".editable-task-text");
        const checkbox = toDoList.querySelector(".checkbox");

        singleTask.addEventListener("paste",()=>singleTask.contentEditable="plaintext-only");
        singleTask.addEventListener("input",()=>singleTask.contentEditable=true);

        checkbox.checked=false;

        checkbox.addEventListener("click",completedSingleTask);

        if (data) {

            singleTask.innerHTML = data.task;

        }

    }


    if (data) {

        if (data.reminder) {
            toDoList.querySelector(".reminder-container").appendChild(createReminder(data.reminder));
            document.querySelector(".set-reminder").value = data.reminder;
            document.querySelector(".save-reminder-button-container").classList.toggle("toggle-edit-button");
        }

        data.tags.forEach(tag=>toDoList.querySelector(".tags-reminders-container").appendChild(createSelectedTag(tag)));

    }

}

toDoListCreatorButton.forEach(button=>button.addEventListener("click",()=>openToDoList(button.dataset.value)));

function toDoListSelected () {

    let toDoLists = document.querySelector(".to-do-list-window-background").children;
    let toDoList;

    for (let i = 0; i < toDoLists.length; i++) {
        if (toDoLists[i].dataset.selected === "true") toDoList = toDoLists[i];
    }

    return toDoList;

}

function saveData () {
    
    let toDoList = toDoListSelected();
    let key = parseInt(toDoList.dataset.key);
    showTag();

    if (toDoList.className === "checkbox-tasks-window") {

        const toDoListTitle = toDoList.querySelector(".editable-to-do-list-title"); 
        const uncompletedTasks = toDoList.querySelectorAll(".editable-task-text");
        const completedTasks = document.querySelectorAll(".completed-task-text");
        const selectedTag = toDoList.querySelectorAll(".selected-tag-text");
        let typeOfList = "checkbox-tasks-window";
        let dateSelected;

        if (toDoList.querySelector(".date-selected")) dateSelected = toDoList.querySelector(".date-selected").innerHTML;

        let uncompletedTasksData = [];
        let completedTasksData = [];
        let selectedTagData = [];
    
        for (let i = 0; i < uncompletedTasks.length; i++) uncompletedTasksData[i] = uncompletedTasks[i].innerHTML;
        for (let i = 0; i < completedTasks.length; i++) completedTasksData[i] = completedTasks[i].innerHTML;
        for (let i = 0; i < selectedTag.length; i++) selectedTagData[i] = selectedTag[i].innerHTML;
        
        if (key) {

            editToDoList(key, {
                title: toDoListTitle.innerHTML.toLowerCase(), 
                uncompletedTasks: uncompletedTasksData, 
                completedTasks: completedTasksData, 
                reminder: dateSelected, 
                tags: selectedTagData, 
                typeOfList: typeOfList
            });

        } else {

            saveToDoList({
                title: toDoListTitle.innerHTML.toLowerCase(),
                uncompletedTasks: uncompletedTasksData,
                completedTasks: completedTasksData,
                reminder: dateSelected,
                tags: selectedTagData,
                typeOfList: typeOfList
            });

        }
    
        deleteToDoListContent();
        numberOfCompletedTasks();

    } else if (toDoList.className === "note-window") {

        const noteTitle = toDoList.querySelector(".editable-to-do-list-title");
        const note = toDoList.querySelector(".editable-note-text");
        const selectedTag = toDoList.querySelectorAll(".selected-tag-text");
        let typeOfList = "note-window";
        let dateSelected;

        if (toDoList.querySelector(".date-selected")) dateSelected = toDoList.querySelector(".date-selected").innerHTML;

        let selectedTagData = [];
    
        for (let i = 0; i < selectedTag.length; i++) selectedTagData[i] = selectedTag[i].innerHTML;
        
        if (key) {

            editToDoList(key, {
                title: noteTitle.innerHTML.toLowerCase(), 
                note: note.innerHTML, 
                reminder: dateSelected, 
                tags: selectedTagData, 
                typeOfList: typeOfList
            });
            
        } else {

            saveToDoList({
                title: noteTitle.innerHTML.toLowerCase(), 
                note: note.innerHTML, 
                reminder: dateSelected, 
                tags: selectedTagData, 
                typeOfList: typeOfList
            })

        }

        deleteToDoListContent();

    } else {

        const singleTask = toDoList.querySelector(".editable-task-text");
        const selectedTag = toDoList.querySelectorAll(".selected-tag-text");
        let typeOfList = "single-task-window";
        let dateSelected;

        if (toDoList.querySelector(".date-selected")) dateSelected = toDoList.querySelector(".date-selected").innerHTML;

        let selectedTagData = [];
    
        for (let i = 0; i < selectedTag.length; i++) selectedTagData[i] = selectedTag[i].innerHTML;

        if (key) {

            editToDoList(key, {
                task: singleTask.innerHTML, 
                reminder: dateSelected, 
                tags: selectedTagData, 
                typeOfList: typeOfList
            });

        } else {

            saveToDoList({
                task: singleTask.innerHTML, 
                reminder: dateSelected, 
                tags: selectedTagData, 
                typeOfList: typeOfList
            })

        }

        deleteToDoListContent();

    }

    if (key) {
        toDoList.removeAttribute("data-key");
    }

    document.querySelector(".remove-reminder-message").style.animation="0.5s forwards hideTaskMessage";

}

function deleteToDoListContent (e) {

    let toDoList = toDoListSelected();
    let key = parseInt(toDoList.dataset.key);


    if (toDoList.className === "checkbox-tasks-window") {

        toDoList.querySelector(".editable-to-do-list-title").innerHTML="";
        document.querySelector(".uncompleted-editable-checkbox-tasks").innerHTML="";
        document.querySelector(".completed-editable-checkbox-tasks").innerHTML="";

    } else if (toDoList.className === "note-window") {

        toDoList.querySelector(".editable-to-do-list-title").innerHTML="";
        toDoList.querySelector(".editable-note-text").innerHTML="";

    } else {

        toDoList.querySelector(".editable-task-text").innerHTML="";

    }
    
    const reminder = toDoList.querySelector(".reminder");

    if (reminder) {
        toDoList.querySelector(".reminder-container").removeChild(reminder)
        document.querySelector(".save-reminder-button-container").classList.toggle("toggle-edit-button");
    }

    const tags = toDoList.querySelectorAll(".selected-tag");
    tags.forEach(tag=>toDoList.querySelector(".tags-reminders-container").removeChild(tag));


    if (e) {

        let deleteButton = e.srcElement;
    
        if (deleteButton.className === "delete-button-window" || deleteButton.className === "material-symbols-outlined") {
            
            if (key) {
                deleteToDoList(key);
                toDoList.removeAttribute("data-key");
            }
            showMessage("Tarea eliminada", "The task has been deleted");
        
        }

    }

    document.querySelector(".to-do-list-window-background").style.animation="0.3s forwards closedWindowAnimation";
    setTimeout(()=>{document.querySelector(".to-do-list-window-background").style.display="none"},300);
    toDoList.style.animation="0.3s forwards closedWindowFade";
    setTimeout(()=>{toDoList.style.display="none"},300);
    toDoList.dataset.selected="false";
    document.querySelector(".set-reminder").value="";

    document.body.style.overflow="auto";

}

function showMessage (spanishMessage, englishMessage) {

    let language = localStorage.getItem("language");

    if (language === "es") document.querySelector(".message-text").innerHTML=spanishMessage;
    else document.querySelector(".message-text").innerHTML=englishMessage;
    
    document.querySelector(".message").style.display="block";
    document.querySelector(".message").style.animation="0.5s forwards showMessage";
    setTimeout(()=>{document.querySelector(".message").style.animation="0.5s forwards hideMessage"},2000);

}


function createUncompletedCheckboxTask (uncompletedTask) {

    let key = taskKeyGenerator();
    let currentLanguage = localStorage.getItem("language");

    let checkboxTaskContainer = createElementHTML("div",[`uncompleted-editable-checkbox-task`, `checkbox-task-${key}`], "");
    let draggableCheckboxContainer = createElementHTML("div",["draggable-checkbox-container"],"");
    let CheckboxContainer = createElementHTML("label",["checkbox-box"],"");
    let UncompletedtaskTextContainer = createElementHTML("div",["uncompleted-checkbox-task-text-container"], "");
    let deleteUncompletedTask = createElementHTML("div",["normal-button-style","delete-uncompleted-task"],"");

    let dragIndicator = createElementHTML("span",["material-symbols-outlined","drag-indicator","normal-button-style"],"drag_indicator");
    let checkboxBackground = createElementHTML("span",["checkbox-background"],"");
    let checkbox = createElementHTML("input",["checkbox"],"","checkbox","");
    let editableTaskText = createElementHTML("div",["editable-task-text"],uncompletedTask,"","");
    let deleteUncompletedTaskIcon = createElementHTML("span",["material-symbols-outlined"],"close");

    if (editableTaskText.innerHTML === "[object PointerEvent]") editableTaskText.innerHTML="";
    editableTaskText.contentEditable = "true";
    if (currentLanguage === "es") editableTaskText.dataset.placeholder = "Tarea";
    else editableTaskText.dataset.placeholder = "Task";
    editableTaskText.addEventListener("paste",()=>editableTaskText.contentEditable="plaintext-only");
    editableTaskText.addEventListener("input",()=>editableTaskText.contentEditable=true);

    deleteUncompletedTask.addEventListener("click",()=>{
        
        setTimeout(()=>{document.querySelector(".uncompleted-editable-checkbox-tasks").removeChild(checkboxTaskContainer)},500);
        checkboxTaskContainer.style.animation="0.5s forwards eraseTaskAnimation";
    
    })

    dragIndicator.addEventListener("mousedown",()=>{
        checkboxTaskContainer.setAttribute("draggable","true");
    });

    dragIndicator.addEventListener("mouseout",()=>{
        checkboxTaskContainer.removeAttribute("draggable");
    })

    checkboxTaskContainer.addEventListener("dragstart",e=>{
        e.dataTransfer.setData("checkBoxId",checkboxTaskContainer.classList.item(1))
        e.dataTransfer.setData("TaskText",editableTaskText.innerHTML);
    })

    checkboxTaskContainer.addEventListener("dragover",e=>{
        e.preventDefault()
        checkboxTaskContainer.classList.add("elementOver");
    });

    checkboxTaskContainer.addEventListener("dragleave",e=>{
        e.preventDefault()
        checkboxTaskContainer.classList.remove("elementOver");
    });

    checkboxTaskContainer.addEventListener("drop",e=>{
        let newTaskText = e.dataTransfer.getData("TaskText");
        let checkboxTaskDraged = document.querySelector(`.${e.dataTransfer.getData("checkBoxId")}`);
        checkboxTaskDraged.querySelector(".editable-task-text").innerHTML=editableTaskText.innerHTML;
        
        editableTaskText.innerHTML = newTaskText;
        checkboxTaskContainer.classList.remove("elementOver");
    })

    draggableCheckboxContainer.appendChild(dragIndicator);
    CheckboxContainer.appendChild(checkboxBackground);
    CheckboxContainer.appendChild(checkbox);
    draggableCheckboxContainer.appendChild(CheckboxContainer);
    UncompletedtaskTextContainer.appendChild(editableTaskText);
    deleteUncompletedTask.appendChild(deleteUncompletedTaskIcon);

    checkboxTaskContainer.appendChild(draggableCheckboxContainer);
    checkboxTaskContainer.appendChild(UncompletedtaskTextContainer);
    checkboxTaskContainer.appendChild(deleteUncompletedTask);

    checkbox.addEventListener("click",()=>{

        if (checkbox.checked) {

            createCompletedCheckboxTask(editableTaskText.innerHTML);
            setTimeout(()=>{document.querySelector(".uncompleted-editable-checkbox-tasks").removeChild(checkboxTaskContainer)},1000)
            checkboxTaskContainer.style.animation="1s checkedTaskAnimation";

        } 

    })

    document.querySelector(".uncompleted-editable-checkbox-tasks").appendChild(checkboxTaskContainer);
    
}

function createCompletedCheckboxTask (completedTask) {

    let checkboxTaskContainer = createElementHTML("div",[`completed-editable-checkbox-task`], "");
    let checkedCheckboxContainer = createElementHTML("div",["checked-checkbox-container"],"");
    let CheckboxContainer = createElementHTML("label",["checkbox-box"],"");
    let completedTaskTextContainer = createElementHTML("div",["completed-task-text-container"],"");
    let deleteCompletedTask = createElementHTML("div",["normal-button-style","delete-completed-task"],"");

    let checkboxBackground = createElementHTML("span",["checkbox-background"],"");
    let checkbox = createElementHTML("input",["checkbox"],"","checkbox","");
    checkbox.setAttribute("checked","true");
    let completedTaskText = createElementHTML("s",["completed-task-text"],completedTask,"","");
    let deleteCompletedTaskIcon = createElementHTML("span",["material-symbols-outlined"],"close");

    CheckboxContainer.appendChild(checkboxBackground);
    CheckboxContainer.appendChild(checkbox);
    checkedCheckboxContainer.appendChild(CheckboxContainer);
    completedTaskTextContainer.appendChild(completedTaskText);
    deleteCompletedTask.appendChild(deleteCompletedTaskIcon);

    checkboxTaskContainer.appendChild(checkedCheckboxContainer);
    checkboxTaskContainer.appendChild(completedTaskTextContainer);
    checkboxTaskContainer.appendChild(deleteCompletedTask);

    deleteCompletedTask.addEventListener("click",()=>{

        setTimeout(()=>{
            document.querySelector(".completed-editable-checkbox-tasks").removeChild(checkboxTaskContainer);
            numberOfCompletedTasks();
        },900)
        checkboxTaskContainer.style.animation="1s eraseTaskAnimation";

    })

    document.querySelector(".completed-editable-checkbox-tasks").appendChild(checkboxTaskContainer);

    checkbox.addEventListener("click",()=>{

        if (checkbox.checked === false) {

            createUncompletedCheckboxTask(completedTaskText.innerHTML);
            setTimeout(()=>{
                document.querySelector(".completed-editable-checkbox-tasks").removeChild(checkboxTaskContainer);
                numberOfCompletedTasks();
            },1000);
            checkboxTaskContainer.style.animation="1s forwards uncheckedTaskAnimation";

        }

    })

    numberOfCompletedTasks();

}

function numberOfCompletedTasks () {

    const completedEditableCheckboxTasks = document.querySelector(".completed-editable-checkbox-tasks");

    if (completedEditableCheckboxTasks.innerHTML !== "") {
        let currentLanguage = localStorage.getItem("language");
        let numberOfTasks = document.querySelector(".completed-editable-checkbox-tasks").children.length;
        document.querySelector(".number-of-completed-tasks-window-container").style.visibility="visible";
        if (currentLanguage === "es")  document.querySelector(".number-of-completed-tasks-window").innerHTML = `Tareas Completas ${numberOfTasks}`;
        else  document.querySelector(".number-of-completed-tasks-window").innerHTML = `Completed tasks ${numberOfTasks}`;
    } else document.querySelector(".number-of-completed-tasks-window-container").style.visibility="hidden";

}

function numberOfCompletedTasksButton () {

    const completedTasks = document.querySelector(".completed-editable-checkbox-tasks");
    const expandMoreIcon = document.querySelector(".expand-more-icon");
    expandMoreIcon.classList.toggle("expand-less");
    completedTasks.classList.toggle("close-completed-tasks");

}

function completedSingleTask () {

    let toDoList = toDoListSelected();
    let key = parseInt(toDoList.dataset.key);
    const singleTask = toDoList.querySelector(".editable-task-text");
    const selectedTag = toDoList.querySelectorAll(".selected-tag-text");
    let typeOfList = "single-task-window";
    let dateSelected;

    console.log(toDoList)

    if (toDoList.querySelector(".date-selected")) dateSelected = toDoList.querySelector(".date-selected").innerHTML;

    let selectedTagData = [];

    for (let i = 0; i < selectedTag.length; i++) selectedTagData[i] = selectedTag[i].innerHTML;

    setTimeout(()=>{

        document.querySelector(".to-do-list-window-background").style.animation="0.3s forwards closedWindowAnimation";
        toDoList.style.animation="0.3s forwards closedWindowFade";

    },1000)
    setTimeout(()=>{

        document.querySelector(".to-do-list-window-background").style.display="none"
        toDoList.style.display="none";
        deleteToDoListContent();
        toDoList.dataset.selected="false";
        document.querySelector(".task-completed-message").style.animation="1s forwards hideTaskMessage";

    },1500);

    saveSingleTask({
        task: singleTask.innerHTML, 
        reminder: dateSelected, 
        tags: selectedTagData, 
        typeOfList: typeOfList
    })

    if (key) deleteToDoList(key);

    document.querySelector(".task-completed-message").style.display="flex";
    document.querySelector(".task-completed-message").style.animation="0.5s forwards showMessage";

}

function selectedTagContainer () {

    let toDoLists = document.querySelector(".to-do-list-window-background").children;
    let toDoList;

    for (let i = 0; i < toDoLists.length; i++) {
        if (toDoLists[i].dataset.selected === "true") toDoList = toDoLists[i];
    }

    return toDoList.querySelector(".tags-reminders-container");

}

function openTagWindow () {

    showTag();

    let tagsContainer = selectedTagContainer();

    document.querySelector(".tag-window-background").style.display="flex";
    document.querySelector(".tag-window-background").style.animation="0.3s forwards openWindowAnimation";

    const tagWindowReturnButton = document.querySelector(".tag-window-return-button");
    const addNewTagButton = document.querySelector(".add-new-tag-button");

    tagWindowReturnButton.addEventListener("click",numberOfTags);

    addNewTagButton.addEventListener("click",addNewTag);

    const selectedTagText = tagsContainer.querySelectorAll(".selected-tag-text");
    let tagWindow = document.querySelector(".tag-window");

    setTimeout(()=>{
        for (let i = 0; i < selectedTagText.length; i++) {

            const checkbox = tagWindow.querySelector(`[value="${selectedTagText[i].innerHTML}"]`);
            checkbox.checked=true;
    
        }
    },100)
    
}

function addNewTag () {

    let addNewTagField = document.querySelector(".add-new-tag-field");

    if (addNewTagField.value === "") document.querySelector(".empty-field-error-message").style.display = "inline";
    else if (addNewTagField.value.length > 50) document.querySelector(".characters-error-message").style.display = "inline";
    else {
        
        document.querySelector(".tags-container").appendChild(createTag(addNewTagField.value));
        document.querySelector(".add-new-tag-field").value="";

    }

    addNewTagField.addEventListener("input",()=>document.querySelectorAll(".error-message").forEach(message=>message.style.display="none"));

}

function createTag (tagValue, id, checkboxChecked) {

    let tag = createElementHTML("div",["tag",`tag-${id}`],"");
    let editTagButton = createElementHTML("div",["normal-button-style","edit-tag-button"],"");
    let checkedCheckboxContainer = createElementHTML("div",["checked-checkbox-container"],"");
    let CheckboxContainer = createElementHTML("label",["checkbox-box"],"");

    let tagIcon = createElementHTML("span",["material-symbols-outlined","tag-icon","icon"],"label");
    let tagText = createElementHTML("p",["tag-text"],tagValue);
    let editIcon = createElementHTML("span",["material-symbols-outlined"],"edit");
    let checkboxBackground = createElementHTML("span",["checkbox-background"],"");
    let checkbox = createElementHTML("input",["checkbox","checkbox-tag", `checkbox-tag-${id}`],"","checkbox","");
    checkbox.value = tagValue;

    if (checkboxChecked) checkbox.checked = true;

    editTagButton.appendChild(editIcon);
    CheckboxContainer.appendChild(checkboxBackground);
    CheckboxContainer.appendChild(checkbox);
    checkedCheckboxContainer.appendChild(CheckboxContainer);

    tag.appendChild(tagIcon);
    tag.appendChild(tagText);
    tag.appendChild(editTagButton);
    tag.appendChild(checkedCheckboxContainer);

    editTagButton.addEventListener("click",()=>{

        tag.replaceWith(createEditableTag(tagText.innerHTML, id, checkbox.checked));

    })

    tag.style.animation="0.3s forwards openWindowAnimation";

    return tag;

}

function numberOfTags () {

    let tagsContainer = selectedTagContainer();

    let checkboxes = document.querySelectorAll(".checkbox-tag");
    let checkboxesArray = [];
    let checkboxesValue = [];

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxesArray[i] = checkboxes[i].checked;
        if (checkboxes[i].checked) checkboxesValue[i] = checkboxes[i].value;
    }

    let checkedCheckboxes = checkboxesArray.filter(checked => checked === true);
    let tagValue = checkboxesValue.filter(value => value !== "empty");

    if (checkedCheckboxes.length > 5) document.querySelector(".tags-error-message-container").style.display = "block";
    else {

        let tags = document.querySelectorAll(".tag-text");
        let selectedTags = tagsContainer.querySelectorAll(".selected-tag");
        selectedTags.forEach(tag=>tagsContainer.removeChild(tag));
        tagValue.forEach(value=>tagsContainer.appendChild(createSelectedTag(value)));
        
        document.querySelector(".tag-window-background").style.animation="0.3s forwards closedWindowAnimation";
        setTimeout(()=>{
            document.querySelector(".tag-window-background").style.display="none";
            deleteTags();
            if (tags) tags.forEach(tag=>saveTag(tag.innerHTML));
        },300)
        setTimeout(()=>{document.querySelector(".tags-container").innerHTML=""},300);
        document.querySelector(".tags-error-message-container").style.display = "none";

    }

}

function createEditableTag (tagValue, id, checkboxChecked) {

    let editableTag = createElementHTML("div",["editable-tag",`editable-tag-${id}`],"");
    let deleteTagButton = createElementHTML("div",["normal-button-style","delete-tag-button"],"");
    let editTagFieldContainer = createElementHTML("div",["edit-tag-field-container"],"");
    let saveEditedTagButton = createElementHTML("div",["save-edited-tag-button","normal-button-style"],"");

    let deleteIcon = createElementHTML("span",["material-symbols-outlined"],"delete");
    let editTagField = createElementHTML("input",["edit-tag-field","input-style"],tagValue,"text","");
    let errorMessage = createElementHTML("span",["error-message"],"");
    let doneIcon = createElementHTML("span",["material-symbols-outlined"],"done");

    errorMessage.style.display = "inline";

    editTagField.setAttribute("maxlength","51");

    deleteTagButton.appendChild(deleteIcon);
    editTagFieldContainer.appendChild(editTagField);
    editTagFieldContainer.appendChild(errorMessage);
    saveEditedTagButton.appendChild(doneIcon);

    editableTag.appendChild(deleteTagButton);
    editableTag.appendChild(editTagFieldContainer);
    editableTag.appendChild(saveEditedTagButton);

    deleteTagButton.addEventListener("click",()=>{

        setTimeout(()=>{document.querySelector(".tags-container").removeChild(editableTag)},300);
        showMessage("Etiqueta eliminada", "The tag has been deleted");

        editableTag.style.animation="0.3s forwards closedWindowAnimation";
        
    })

    editTagField.addEventListener("input",()=>errorMessage.innerHTML = "");

    saveEditedTagButton.addEventListener("click",()=>{

        let language = localStorage.getItem("language");

        if (editTagField.value === "") {

            if (language === "es") errorMessage.innerHTML = "Campo vacio";
            else errorMessage.innerHTML = "Empty field";

        }

        else if (editTagField.value.length > 50) {

            if (language === "es") errorMessage.innerHTML = "Escriba un nombre mas corto";
            else errorMessage.innerHTML = "Write a shorter tag";

        }
        
        else {

            editableTag.replaceWith(createTag(editTagField.value, id, checkboxChecked));
            editTag(editTagField.value,id);

        }

    }) 

    return editableTag;

}

function createSelectedTag (tagValue) {

    let selectedTag = createElementHTML("div",["selected-tag"],"");
    let tagIcon = createElementHTML("span",["material-symbols-outlined"],"label");
    let selectedTagText = createElementHTML("p",["selected-tag-text"],tagValue);

    selectedTag.appendChild(tagIcon);
    selectedTag.appendChild(selectedTagText);

    return selectedTag;

}

function openReminder () {

    let tagsContainer = selectedTagContainer();

    document.querySelector(".reminder-window-background").style.display="flex";
    document.querySelector(".reminder-window-background").style.animation="0.3s forwards openWindowAnimation";

    const reminderWindowReturnButton = document.querySelector(".reminder-window-return-button");
    const deleteDate = document.querySelector(".delete-date");
    const saveReminderButton = document.querySelector(".save-reminder-button");
    const editReminderButton = document.querySelector(".edit-reminder-button");

    reminderWindowReturnButton.addEventListener("click",()=>{
        document.querySelector(".reminder-window-background").style.animation="0.3s forwards closedWindowAnimation";
        setTimeout(()=>{document.querySelector(".reminder-window-background").style.display="none"},300)
    });

    deleteDate.addEventListener("click",()=>{

        let reminder = tagsContainer.querySelector(".reminder");
        let setReminder = document.querySelector(".set-reminder");
        setReminder.value = "";

        if (reminder) {

            tagsContainer.querySelector(".reminder-container").removeChild(reminder);
            document.querySelector(".save-reminder-button-container").classList.toggle("toggle-edit-button");

        }

        showMessage("Recordatorio eliminado", "The reminder has been deleted");

    })

    saveReminderButton.addEventListener("click",saveReminder);

    editReminderButton.addEventListener("click",editReminder);

}

function editReminder () {

    let tagsContainer = selectedTagContainer();
    let dateSelected = tagsContainer.querySelector(".date-selected");

    if (dateSelected !== null) {
        let setReminder = document.querySelector(".set-reminder").value;
        dateSelected.innerHTML = setReminder;
        showMessage("Recordatorio editado", "The reminder has been edited");
    } else document.querySelector(".save-reminder-button-container").classList.toggle("toggle-edit-button");

}


function createReminder (date) {

    let reminder = createElementHTML("div",["reminder"],"");
    let reminderIcon = createElementHTML("span",["material-symbols-outlined"],"event");
    let dateSelected = createElementHTML("p",["date-selected"],date);

    reminder.appendChild(reminderIcon);
    reminder.appendChild(dateSelected);

    return reminder;

}

function saveReminder () {

    let tagsContainer = selectedTagContainer();

    let setReminder = document.querySelector(".set-reminder").value;

    if (setReminder === "") document.querySelector(".empty-date-error-message").style.display="inline";
    else {

        document.querySelector(".save-reminder-button-container").classList.toggle("toggle-edit-button");
        tagsContainer.querySelector(".reminder-container").appendChild(createReminder(setReminder));
        document.querySelector(".empty-date-error-message").style.display="none";
        showMessage("Recordatorio establecido", "The reminder has been set");
    
    }

}

const deleteButtonWindow = document.querySelector(".delete-button-window");

deleteButtonWindow.addEventListener("click",()=>{
    
    const editableTaskText = document.querySelectorAll(".editable-task-text")
    const editableToDoListTitle = document.querySelectorAll(".editable-to-do-list-title");

    document.querySelector(".editable-to-do-list-title").innerHTML = "";
    document.querySelector(".uncompleted-editable-checkbox-tasks").innerHTML = "";
    document.querySelector(".completed-editable-checkbox-tasks").innerHTML = "";
    editableToDoListTitle.forEach(title=>title.value="");
    editableTaskText.forEach(task=>task.innerHTML="");
    localStorage.setItem("taskKey",0);
    numberOfCompletedTasks();

})

function taskKeyGenerator () {

    let newKey = parseInt(localStorage.getItem("taskKey"));
    newKey++;
    localStorage.setItem("taskKey",newKey);
    
    return newKey;

}

function tagKeyGenerator () {

    let newKey = parseInt(localStorage.getItem("tagKey"));
    newKey++;
    localStorage.setItem("tagKey",newKey);
    
    return newKey;

}

function createToDoList (content, key, checked) {

    let data = content;

    let toDoList;

    if (data.typeOfList === "checkbox-tasks-window") {

        toDoList = createElementHTML("div",["box-style","checkbox-to-do-list-container",`${key}`],"");
        let uncompletedTasks = createElementHTML("div",["uncompleted-checkbox-tasks-container"],"");
        let numberOfCompletedTasksContainer = createElementHTML("div",["number-of-completed-tasks-container"],"");

        let toDoListTitle = createElementHTML("h1",["to-do-list-title"],data.title);

        for (let i = 0; i < data.uncompletedTasks.length; i++) {

            let checkboxTask = createElementHTML("div",["checkbox-task"],"");
            let CheckboxContainer = createElementHTML("div",["checkbox-container"],"");
            let checkboxBox = createElementHTML("label",["checkbox-box"],"");

            let checkboxBackground = createElementHTML("span",["checkbox-background"],"");
            let checkbox = createElementHTML("input",["checkbox"],"","checkbox","");
            let task = createElementHTML("p",["task"],data.uncompletedTasks[i]);
            
            checkboxBox.appendChild(checkboxBackground);
            checkboxBox.appendChild(checkbox);
            CheckboxContainer.appendChild(checkboxBox);

            checkboxTask.appendChild(CheckboxContainer);
            checkboxTask.appendChild(task);

            uncompletedTasks.appendChild(checkboxTask);

        }

        if (data.completedTasks.length !== 0) {

            let language = localStorage.getItem("language");

            let numberOfCompletedTasks = createElementHTML("p",["number-of-completed-tasks"],"");
            let expandMoreIcon = createElementHTML("span",["material-symbols-outlined", "expand-more-icon"],"expand_more");

            if (language === "es") numberOfCompletedTasks.innerHTML = `Tareas completas ${data.completedTasks.length}`;
            else numberOfCompletedTasks.innerHTML = `Completed tasks ${data.completedTasks.length}`;

            numberOfCompletedTasksContainer.appendChild(numberOfCompletedTasks);
            numberOfCompletedTasksContainer.appendChild(expandMoreIcon);

        }

        toDoList.appendChild(toDoListTitle);
        toDoList.appendChild(uncompletedTasks);
        toDoList.appendChild(numberOfCompletedTasksContainer);

    } else if (data.typeOfList === "note-window") {

        toDoList = createElementHTML("div",["box-style","note-to-do-list-container",`${key}`],"");
        let noteContainer = createElementHTML("div",["note-container"],"");

        let toDoListTitle = createElementHTML("h1",["to-do-list-title"],data.title);
        let note = createElementHTML("p",["note"],data.note);

        noteContainer.appendChild(note);
        toDoList.appendChild(toDoListTitle);
        toDoList.appendChild(noteContainer);

    } else {

        toDoList = createElementHTML("div",["box-style","single-task-to-do-list-container",`${key}`],"");
        let singleTaskContainer = createElementHTML("div",["single-task-container"],"");
        let checkboxTask = createElementHTML("div",["checkbox-task"],"");
        let CheckboxContainer = createElementHTML("div",["checkbox-container"],"");
        let checkboxBox = createElementHTML("label",["checkbox-box"],"");
        let deleteButton = createElementHTML("div",["button-style","delete-single-task-button"], "");
        
        let checkboxBackground = createElementHTML("span",["checkbox-background"],"");
        let checkbox = createElementHTML("input",["checkbox"],"","checkbox","");
        let task = createElementHTML("p",["task"],data.task);
        let deleteIcon = createElementHTML("span",["material-symbols-outlined"], "close");

        checkbox.addEventListener("input",()=>{
            saveToDoList({
                task: data.task, 
                reminder: data.reminder, 
                tags: data.tags, 
                typeOfList: data.typeOfList
            })
            let elementKey = key;
            deleteSingleTask(elementKey);
        })

        checkboxBox.appendChild(checkboxBackground);
        checkboxBox.appendChild(checkbox);
        CheckboxContainer.appendChild(checkboxBox);
        deleteButton.appendChild(deleteIcon);

        checkboxTask.appendChild(CheckboxContainer);
        checkboxTask.appendChild(task);
        singleTaskContainer.appendChild(checkboxTask);

        toDoList.appendChild(singleTaskContainer);

        deleteButton.addEventListener("click",()=>{

            deleteSingleTask(key)

        });
        
        if (checked) toDoList.appendChild(deleteButton);

    }

    let tagsReminderContainer = createElementHTML("div",["tags-reminders-container"],"");
    let reminderContainer = createElementHTML("div",["reminder-container"],"");

    let hoverStyle = createElementHTML("div",["hover-style"],"");

    if (data.reminder !== undefined) {

        let reminder = createElementHTML("div",["reminder"],"");
        let calendarIcon = createElementHTML("span",["material-symbols-outlined"],"event");
        let dateSelected = createElementHTML("p",["date-selected"],data.reminder);
        
        reminder.appendChild(calendarIcon);
        reminder.appendChild(dateSelected);
        reminderContainer.appendChild(reminder);

    }

    tagsReminderContainer.appendChild(reminderContainer);

    for (let i = 0; i < data.tags.length; i++) {

        let selectedTag = createElementHTML("div",["selected-tag"],"");
        let tagIcon = createElementHTML("span",["material-symbols-outlined"],"label");
        let selectedTagText = createElementHTML("p",["selected-tag-text"],data.tags[i]);
        
        selectedTag.appendChild(tagIcon);
        selectedTag.appendChild(selectedTagText);
        tagsReminderContainer.appendChild(selectedTag);

    }

    toDoList.appendChild(tagsReminderContainer);
    toDoList.appendChild(hoverStyle);

    toDoList.style.animation="1s forwards openWindowAnimation";
    toDoList.dataset.value = data.typeOfList;

    if (!checked) toDoList.addEventListener("click",()=>openToDoList(data.typeOfList, data, key));
    else console.log("Chekeado wey");

    return toDoList;

}

function addZeros (number) {

    if (number <= 9) return `0${number}`;
    else return number;

}

function dateVerification () {

    setTimeout(()=>{

        const toDoLists = document.querySelector(".tasks").children;
        const date = new Date();

        let currentDate = `${date.getFullYear()}-${addZeros(date.getMonth() + 1)}-${addZeros(date.getDate())}`;

        for (let i = 0; i < toDoLists.length; i++) {

            let reminder = toDoLists[i].querySelector(".date-selected");
            let key = parseInt(toDoLists[i].classList.item(2));
            
            if (reminder !== null) {
                if (reminder.innerHTML === currentDate) showNotification(key);
            }

        }

    },1000)

}

function createNotification (content, key) {

    let data = content;
    let numberOfPendingTasks = document.querySelector(".number-of-pending-tasks");
    let notificationDot = document.querySelector(".notification-dot");
    let currentLanguage = localStorage.getItem("language");

    let dropdownMenuOption = createElementHTML("div",["dropdown-menu-option", "dropdown-menu-option-notification"],"");
    let notificationContent = createElementHTML("div",["notification-content"],"");

    let PendingIcon = createElementHTML("span",["material-symbols-outlined","pending-icon"],"pending_actions");

    if (data.typeOfList === "checkbox-tasks-window") {

        let notificationTitle = createElementHTML("h2",["notification-title"],data.title);
        notificationContent.appendChild(notificationTitle);
        for (let i = 0; i < data.uncompletedTasks.length; i++) {
            
            let notificationText = createElementHTML("p",["notification-text"],data.uncompletedTasks[i]);
            notificationContent.appendChild(notificationText);
            if (i === 4) break;  

        }

    } else if (data.typeOfList === "note-window") {

        let notificationTitle = createElementHTML("h2",["notification-title"],data.title);
        let notificationText = createElementHTML("p",["notification-text"],data.note);
        notificationContent.appendChild(notificationTitle);
        notificationContent.appendChild(notificationText);

    } else {

        let notificationText = createElementHTML("p",["notification-text"],data.task)
        notificationContent.appendChild(notificationText);

    }

    dropdownMenuOption.appendChild(PendingIcon);
    dropdownMenuOption.appendChild(notificationContent);

    dropdownMenuOption.addEventListener("click",()=>{

        openToDoList(data.typeOfList, data, key);

        let parent = dropdownMenuOption.parentElement

        if (parent.className === "dropdown-menu-option-container") {

            document.querySelector(".dropdown-menu-option-container").removeChild(dropdownMenuOption);

            if (document.querySelector(".dropdown-menu-option-container").innerHTML === "") {
                document.querySelector(".notification-message-container").style.display="flex";
                numberOfPendingTasks.innerHTML="";
                notificationDot.style.display="none";
            } else {
                let numberOfTasks = document.querySelector(".dropdown-menu-option-container").children.length;
                if (currentLanguage === "es") numberOfPendingTasks.innerHTML = `Tareas Pendientes: ${numberOfTasks}`;
                else numberOfPendingTasks.innerHTML = `Pending Tasks: ${numberOfTasks}`;
            }
            document.querySelector(".remove-reminder-message").style.display="flex";
            document.querySelector(".remove-reminder-message").style.animation="0.5s forwards showMessage";

        } else {
            document.querySelector(".search-bar").value="";
            document.querySelector(".search-result-container").innerHTML="";
        }

    });

    return dropdownMenuOption;

}

let acceptButton = document.querySelector(".accept-button");
let cancelButton = document.querySelector(".cancel-button");

function removeReminder () {

    let toDoList = toDoListSelected();

    let reminder = toDoList.querySelector(".reminder");
    let parent = reminder.parentElement;
    parent.removeChild(reminder);

    document.querySelector(".remove-reminder-message").style.animation="0.5s forwards hideTaskMessage";

}

acceptButton.addEventListener("click",removeReminder);
cancelButton.addEventListener("click",()=>document.querySelector(".remove-reminder-message").style.animation="0.5s forwards hideTaskMessage");

let tasksButton = document.querySelectorAll(".tasks-button");
let tagsButton = document.querySelectorAll(".tags-button");

tasksButton.forEach(task=>task.addEventListener("click",()=>{
    document.querySelector(".all-tags").style.display="none";
    document.querySelector(".all-tasks").style.display="block";
}))

tagsButton.forEach(tag=>tag.addEventListener("click",()=>{
    document.querySelector(".all-tasks").style.display="none";
    document.querySelector(".all-tags").style.display="block";
    showTag();
    showToDoList();
}))

function createTagOption (tagValue) {

    let tagOption = createElementHTML("li",["dropdown-menu-option","tag-option"],tagValue,"","");
    let taskContainer = createElementHTML("div",["task-container"],"");
    taskContainer.dataset.tag = tagValue;
    taskContainer.style.display="none";
    tagOption.dataset.value = tagValue;

    document.querySelector(".tasks-container").appendChild(taskContainer);
    
    tagOption.addEventListener("click",()=>{

        const tagSelected = document.querySelector(".tag-selected");
        const notSelectedTags = document.querySelectorAll(".task-container");
        
        tagSelected.innerHTML = tagOption.innerHTML;
        notSelectedTags.forEach(tag=>tag.style.display="none");

        taskContainer.style.display="block";
        if (taskContainer.innerHTML === "") document.querySelector(".no-tasks-in-tag-message").style.display = "flex";
        else document.querySelector(".no-tasks-in-tag-message").style.display = "none";

    })

    return tagOption;

}



const scrollValue = window.scrollY;

window.addEventListener("scroll",()=>{
    const scrollValue = window.scrollY;

    if (scrollValue > 500) document.querySelector(".go-up-button").style.display="flex";
    else document.querySelector(".go-up-button").style.display="none";
})

const searchResult = document.querySelector(".search-bar");

searchResult.addEventListener("input",searchTask);

searchResult.addEventListener("focus",()=>{
    document.querySelector(".search-result-background").style.display="block";
});

searchResult.addEventListener("blur",()=>{
    setTimeout(()=>{
        document.querySelector(".search-result-background").style.display="none";
        document.querySelector(".search-result-container").innerHTML="";
    },100);
});

const menuButton = document.querySelector(".menu-button");
const closeMenuButton = document.querySelector(".close-menu-button");

menuButton.addEventListener("click",()=>document.querySelector(".side-menu-background").classList.toggle("toggle-side-menu"));

closeMenuButton.addEventListener("click",()=>{
    setTimeout(()=>{
        document.querySelector(".side-menu-background").classList.toggle("toggle-side-menu")
        document.querySelector(".side-menu").removeAttribute("style")
    },300)
    document.querySelector(".side-menu").style.animation="0.3s forwards closeSideMenu";
});

///// Settings ////////////////////////////////

const optionSettingsButton = document.querySelectorAll(".dropdown-menu-option-settings");
const closeSettingsButton = document.querySelector(".close-settings-button");
const optionButtons = document.querySelector(".settings-options").children;
const imagePicker = document.getElementById("image-picker");
const imageProfile = document.querySelector(".editable-profile-image");
const closeImageButton = document.querySelector(".close-image");
const editUserNameButton = document.querySelector(".edit-user-name-button");
const editEmailButton = document.querySelector(".edit-email-button");
const languageButton = document.querySelectorAll(".language-button");
const lightButton = document.querySelector(".light-theme");
const darkButton = document.querySelector(".dark-theme");

function openSettings () {

    document.querySelector(".settings-window-background").style.display="flex";
    document.querySelector(".settings-window-background").style.animation="0.3s forwards openWindowAnimation";

    document.querySelector(".settings-window").style.animation="0.3s forwards openSettingsAnimation";

    let disableSettings = document.querySelectorAll(".settings");
    disableSettings.forEach(setting=>setting.style.display="none");

    document.querySelector(".profile-settings").style.display="flex";
    document.querySelector(".toggle-profile").checked=true;

}

function closeSettings () {

    setTimeout(()=>{document.querySelector(".settings-window-background").style.display="none"},300);
    document.querySelector(".settings-window-background").style.animation="0.3s forwards closedWindowAnimation";

    document.querySelector(".settings-window").style.animation="0.3s forwards closeSettingsAnimation";

}

function selectOption (optionSelected) {

    let disableSettings = document.querySelectorAll(".settings");
    disableSettings.forEach(setting=>setting.style.display="none");

    document.querySelector(`.${optionSelected}`).style.display="flex";

}

function readImage (file) {

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load",()=>{

        const newImageProfile = document.querySelector(".editable-profile-image");
        newImageProfile.src = reader.result;
        document.querySelector(".profile-image").src = reader.result;
        const menuProfileImage = document.querySelectorAll(".dropdown-menu-profile-image");
        menuProfileImage.forEach(image=>image.src = reader.result);

        localStorage.setItem("profile-image", reader.result);

    });

}

imagePicker.addEventListener("change",e=>{

    readImage(imagePicker.files[0])

});

function openImage (e) {

    let imageURL = e.srcElement.currentSrc;

    document.querySelector(".image-background").style.display="flex";
    document.querySelector(".image-displayed").src = imageURL;

}

function closeImage () {

    document.querySelector(".image-background").style.display="none";

}

function editUserName () {

    const userName = document.querySelector(".user-name");
    const editUserNameButton = document.querySelector(".edit-user-name-button");

    let userNameField = createElementHTML("input", ["user-name-field","input-style"], userName.innerHTML, "text", "");
    let saveUserNameButton = createElementHTML("div",["save-user-name","normal-button-style"],"");
    let saveIcon = createElementHTML("span",["material-symbols-outlined"],"chevron_right");

    saveUserNameButton.appendChild(saveIcon);

    userName.replaceWith(userNameField);
    userNameField.focus();
    editUserNameButton.replaceWith(saveUserNameButton);

    saveUserNameButton.addEventListener("click",SaveUserName);

}

function SaveUserName () {

    let currentLanguage = localStorage.getItem("language");
    const userNameField = document.querySelector(".user-name-field");
    const saveUserNameButton = document.querySelector(".save-user-name");

    if (userNameField.value === "") {
        document.querySelector(".user-name-error-message").style.visibility = "visible";
        if (currentLanguage === "es") document.querySelector(".user-name-error-message").innerHTML = "Campo vacio";
        else document.querySelector(".user-name-error-message").innerHTML = "Empty field";
    }
    else if (userNameField.value.length < 8 || userNameField.value.length > 12) {
        document.querySelector(".user-name-error-message").style.visibility = "visible";
        if (currentLanguage == "es") document.querySelector(".user-name-error-message").innerHTML = "El usuario debe tener minimo 8 caracteres y maximo 12 caracteres";
        else document.querySelector(".user-name-error-message").innerHTML = "Username must have a minimum of 8 characters and a maximum of 12";
    }
    else {

        let newUserName = createElementHTML("p",["user-name"],userNameField.value);
        let editUserNameButton = createElementHTML("div",["edit-user-name-button","normal-button-style"],"");
        let editIcon = createElementHTML("span",["material-symbols-outlined"],"edit");

        editUserNameButton.appendChild(editIcon);

        userNameField.replaceWith(newUserName);
        saveUserNameButton.replaceWith(editUserNameButton);

        editUserNameButton.addEventListener("click",editUserName);

        const menuProfileName = document.querySelectorAll(".dropdown-menu-profile-name");
        menuProfileName.forEach(name=>name.innerHTML = userNameField.value);

        document.querySelector(".user-name-error-message").style.visibility = "hidden";

        localStorage.setItem("user-name", userNameField.value);

        showMessage("Nombre de usuario guardado", "The username has been saved");

    }

}

function editEmail () {

    const email = document.querySelector(".email");
    const editEmailButton = document.querySelector(".edit-email-button");

    let emailField = createElementHTML("input",["email-field","input-style"],email.innerHTML,"text","");
    let saveEmailButton = createElementHTML("div",["save-email","normal-button-style"],"");
    let saveIcon = createElementHTML("span",["material-symbols-outlined"],"chevron_right");

    saveEmailButton.appendChild(saveIcon);

    email.replaceWith(emailField);
    emailField.focus();
    editEmailButton.replaceWith(saveEmailButton);

    saveEmailButton.addEventListener("click",saveEmail);

}

function saveEmail () {

    let currentLanguage = localStorage.getItem("language");
    const emailField = document.querySelector(".email-field");
    const saveEmailButton = document.querySelector(".save-email");

    if (emailField.value === "") {
        document.querySelector(".email-error-message").style.visibility = "visible";
        if (currentLanguage === "es") document.querySelector(".email-error-message").innerHTML = "Campo vacio";
        else document.querySelector(".email-error-message").innerHTML = "Empty field";
    }
    else if (!emailField.value.includes("@gmail.com")) {
        document.querySelector(".email-error-message").style.visibility = "visible";
        if (currentLanguage === "es") document.querySelector(".email-error-message").innerHTML = "Email incompleto";
        else document.querySelector(".email-error-message").innerHTML = "Incomplete Email";
    }
    else {

        let newEmail = createElementHTML("p",["email"],emailField.value);
        let editEmailButton = createElementHTML("div",["edit-email-button","normal-button-style"],"");
        let editIcon = createElementHTML("span",["material-symbols-outlined"],"edit");

        editEmailButton.appendChild(editIcon);

        emailField.replaceWith(newEmail);
        saveEmailButton.replaceWith(editEmailButton);

        editEmailButton.addEventListener("click",editEmail);

        const menuProfileEmail = document.querySelectorAll(".dropdown-menu-profile-email");
        menuProfileEmail.forEach(email=>email.innerHTML = emailField.value);

        document.querySelector(".email-error-message").style.visibility = "hidden";

        localStorage.setItem("email", emailField.value);

        showMessage("Email guardado", "The email has been saved");

    }

}

function loadProfileSettings() {

    let savedProfileImage = localStorage.getItem("profile-image");
    let savedUserName = localStorage.getItem("user-name");
    let savedEmail = localStorage.getItem("email");

    if (savedProfileImage) {

        const menuProfileImage = document.querySelectorAll(".dropdown-menu-profile-image");
        menuProfileImage.forEach(image=>image.src = savedProfileImage);
        document.querySelector(".profile-image").src = savedProfileImage;
        document.querySelector(".editable-profile-image").src = savedProfileImage;

    }

    if (savedUserName) {

        const menuProfileName = document.querySelectorAll(".dropdown-menu-profile-name")
        menuProfileName.forEach(name=>name.innerHTML = savedUserName);
        document.querySelector(".user-name").innerHTML = savedUserName;
    
    }

    if (savedEmail) {

        const menuProfileEmail = document.querySelectorAll(".dropdown-menu-profile-email");
        menuProfileEmail.forEach(email=>email.innerHTML = savedEmail);
        document.querySelector(".email").innerHTML = savedEmail;

    }

}

async function changeLanguage (lan) {

    const htmlElements = document.querySelectorAll("[data-section]");

    let request = await fetch(`${lan}.json`);
    let transladation = await request.json();

    htmlElements.forEach(element=>{

        let section = element.dataset.section;
        let value = element.dataset.value;
        
        if (element.getAttribute("placeholder")) element.placeholder = transladation[section][value];
        else if (element.getAttribute("data-placeholder")) element.dataset.placeholder = transladation[section][value];
        else element.innerHTML = transladation[section][value];

    })

    localStorage.setItem("language",lan);

    let currentLanguage = localStorage.getItem("language")
    let numberOfTasks = document.querySelector(".dropdown-menu-option-container").children.length;
    let numberOfPendingTasks = document.querySelector(".number-of-pending-tasks");

    if (numberOfTasks !== 0) {
        if (currentLanguage === "es") numberOfPendingTasks.innerHTML = `Tareas Pendientes: ${numberOfTasks}`;
        else numberOfPendingTasks.innerHTML = `Pending tasks: ${numberOfTasks}`;
    }
    
}

function loadLanguageSettings () {

    let language = localStorage.getItem("language");

    if (language) {

        changeLanguage(language);
        const selectedLanguage = document.querySelector(`[data-value="${language}"]`);
        selectedLanguage.querySelector(".toggle-language").checked = true;

    }

}

function toggleLightTheme () {

    const lightButton = document.querySelector(".light-theme");
    document.body.classList.remove("dark-mode");
    
    localStorage.setItem("theme","light");

    lightButton.querySelector(".toggle-theme").checked=true;

}
function toggleDarkTheme () {

    const darkButton = document.querySelector(".dark-theme");
    document.body.classList.add("dark-mode");

    localStorage.setItem("theme","dark");

    darkButton.querySelector(".toggle-theme").checked=true;

}

function loadThemeSettings () {

    let theme = localStorage.getItem("theme");

    if (theme) {
        if (theme === "light") toggleLightTheme();
        else toggleDarkTheme();
    }

}

optionSettingsButton.forEach(button=>button.addEventListener("click",openSettings));
closeSettingsButton.addEventListener("click",closeSettings);
imageProfile.addEventListener("click",openImage);
closeImageButton.addEventListener("click",closeImage);
editUserNameButton.addEventListener("click",editUserName);
editEmailButton.addEventListener("click",editEmail);
languageButton.forEach(button=>button.addEventListener("click",()=>changeLanguage(button.dataset.value)));
for (let i = 0; i < optionButtons.length; i++) optionButtons[i].addEventListener("click",()=>selectOption(optionButtons[i].dataset.value));
lightButton.addEventListener("click",toggleLightTheme);
darkButton.addEventListener("click",toggleDarkTheme);


function createElementHTML (tag, classes=[], value, type, placeholder) {

    let elementHTML = document.createElement(tag);
    elementHTML.classList.add(...classes);
    elementHTML.innerHTML = value;
    elementHTML.type = type;
    elementHTML.placeholder = placeholder;

    if (type === "") elementHTML.removeAttribute("type");
    if (placeholder === "")  elementHTML.removeAttribute("placeholder");
    if (type === "text") elementHTML.value = value;

    return elementHTML;

}

function createNoTaskMessage () {

    let noTasksMessage =  createElementHTML("div",["no-tasks-message"],"");
    let noTasksIcon = createElementHTML("span",["material-symbols-outlined", "no-tasks-icon"],"assignment");
    let noTasksText = createElementHTML("p",["no-tasks-text"], "No hay tareas por el momento");

    noTasksMessage.appendChild(noTasksIcon);
    noTasksMessage.appendChild(noTasksText);

    return noTasksMessage;

}

const singleTasksButton = document.querySelectorAll(".single-tasks-completed-button");
const singleTasksReturnButton = document.querySelector(".single-tasks-completed-return-button");

function openSingleTasks () {

    document.querySelector(".single-tasks-completed-background").style.display="flex";
    document.querySelector(".single-tasks-completed-background").style.animation="0.5s forwards openWindowAnimation";
    document.querySelector(".single-tasks-completed").style.animation="0.5s forwards openSettingsAnimation";
    document.body.style.overflow="hidden";

    showSingleTask();

}

function closeSingleTasks () {

    setTimeout(()=>{document.querySelector(".single-tasks-completed-background").style.display="none"},500)
    document.querySelector(".single-tasks-completed-background").style.animation="0.5s forwards closedWindowAnimation";
    document.querySelector(".single-tasks-completed").style.animation="0.5s forwards closeSettingsAnimation";
    document.body.style.overflow="auto";

}

singleTasksReturnButton.addEventListener("click",closeSingleTasks);
singleTasksButton.forEach(button=>button.addEventListener("click",openSingleTasks));

function completedTasksVerification () {

    const completedTasksText = document.querySelector(".single-tasks-completed-title");
    let language = localStorage.getItem("language");
    let numberOfTasks = document.querySelector(".single-tasks-completed-container").children.length;

    if (language === "es") completedTasksText.innerHTML=`Tareas completadas ${numberOfTasks}`;
    else completedTasksText.innerHTML=`Completed tasks ${numberOfTasks}`;

}

///// IndexedDB ////////////////////////////////////////////

const IDBrequest = indexedDB.open("ToDoListDataBase");

IDBrequest.addEventListener("upgradeneeded",()=>{

    const db = IDBrequest.result;
    db.createObjectStore("tags",{autoIncrement: true});
    db.createObjectStore("completedTasks",{autoIncrement: true});
    const IDBindex = db.createObjectStore("tasks",{autoIncrement: true});
    IDBindex.createIndex("taskTitles","title",{unique: false});
    IDBindex.createIndex("TagsToDoList","tags", {unique: false});

})

IDBrequest.addEventListener("success",()=>{
    showToDoList();
    showTag();
});

function saveToDoList (obj) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tasks","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tasks");

    IDBtransaction.addEventListener("complete",showToDoList);

    IDBstorage.add(obj);

}

function editToDoList (key, obj) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tasks","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tasks");

    IDBtransaction.addEventListener("complete",showToDoList);

    IDBstorage.put(obj, key);

}

function showToDoList () {

    document.querySelector(".tasks").innerHTML="";
    document.querySelectorAll(".task-container").forEach(tag=>tag.innerHTML="");

    let db = IDBrequest.result;
    let IDBtransaction = db.transaction("tasks","readonly");
    let IDBstorage = IDBtransaction.objectStore("tasks");
    let cursor = IDBstorage.openCursor();

    cursor.addEventListener("success",()=>{

        if (cursor.result) {

            let data = cursor.result.value;
            let key = cursor.result.key;

            document.querySelector(".tasks").appendChild(createToDoList(data, key));
            setTimeout(()=>{data.tags.forEach(tag=>document.querySelector(`[data-tag="${tag}"]`).appendChild(createToDoList(data, key)))},100);
            document.querySelector(".no-tasks-message").style.display = "none"
            

            cursor.result.continue(); 
    
        } else {
            const tasks = document.querySelector(".tasks");
            if (tasks.innerHTML === "") document.querySelector(".no-tasks-message").style.display = "flex";
        }

    })

}

function showNotification (key) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tasks","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tasks");
    const itemSeletected = IDBstorage.get(key);

    itemSeletected.addEventListener("success",()=>{

        let data = itemSeletected.result;
        let numberOfPendingTasks = document.querySelector(".number-of-pending-tasks");
        let notificationDot = document.querySelector(".notification-dot");
        let currentLanguage = localStorage.getItem("language");

        document.querySelector(".dropdown-menu-option-container").appendChild(createNotification(data, key));
        document.querySelector(".notification-message-container").style.display="none";
    
        let numberOfTasks = document.querySelector(".dropdown-menu-option-container").children.length;
        if (currentLanguage === "es") numberOfPendingTasks.innerHTML = `Tareas Pendientes: ${numberOfTasks}`;
        else numberOfPendingTasks.innerHTML = `Pending tasks: ${numberOfTasks}`;
        notificationDot.style.display="block";
    
    })

}

function deleteToDoList (key) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tasks","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tasks");

    IDBtransaction.addEventListener("complete",showToDoList);

    IDBstorage.delete(key);

}

function searchTask () {

    let searchResult = document.querySelector(".search-bar").value.toLowerCase();

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tasks","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tasks");

    const IDBindex = IDBstorage.index("taskTitles");
    const range = IDBKeyRange.only(searchResult);
    const cursor = IDBindex.openCursor(range);

    cursor.addEventListener("success",()=>{
        
        if (cursor.result) {

            let data = cursor.result.value;
            let key = cursor.result.primaryKey;

            document.querySelector(".search-result-container").appendChild(createNotification(data, key));

            let parent = document.querySelector(".search-result-container");
            parent.querySelector(".dropdown-menu-option").classList.add("search-menu-option");

        } else {
            document.querySelector(".search-result-container").innerHTML="";
        }

    })

}

function deleteTags () {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tags","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tags");

    IDBtransaction.addEventListener("complete",showTag);

    IDBstorage.clear();

}

function saveTag (tag) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tags","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tags");

    IDBtransaction.addEventListener("complete",showTag);

    IDBstorage.add(tag)

}

function editTag (newTag, key) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tags","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tags");

    IDBstorage.put(newTag, key);

}

function deleteTag (key) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tags","readwrite");
    const IDBstorage = IDBtransaction.objectStore("tags");

    IDBstorage.delete(key)

}


function showTag () {

    document.querySelector(".tasks-container").innerHTML="";
    document.querySelector(".tag-options").innerHTML="";
    document.querySelector(".tags-container").innerHTML="";

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("tags","readonly");
    const IDBstorage = IDBtransaction.objectStore("tags");
    const cursor = IDBstorage.openCursor();

    cursor.addEventListener("success",()=>{

        if (cursor.result) {

            let tag = cursor.result.value;
            let key = cursor.result.key;

            document.querySelector(".tags-container").appendChild(createTag(tag,key));
            document.querySelector(".tag-options").appendChild(createTagOption(tag));   

            cursor.result.continue();

            const firstTag = document.querySelector(".tag-option");
            const tagSelected = document.querySelector(".tag-selected");
            tagSelected.innerHTML = firstTag.innerHTML;
            document.querySelector(`[data-tag="${firstTag.innerHTML}"]`).style.display="block";
            setTimeout(()=>{
                if (document.querySelector(`[data-tag="${firstTag.innerHTML}"]`).innerHTML === "") document.querySelector(".no-tasks-in-tag-message").style.display = "flex";
                else document.querySelector(".no-tasks-in-tag-message").style.display = "none";
            },300)
            document.querySelector(".tag-options-container").style.display = "block";
            document.querySelector(".no-tags-message").style.display = "none";

            
        } else {
            const tags = document.querySelector(".tag-options");
            if (tags.innerHTML === "") {
                document.querySelector(".tag-options-container").style.display = "none";
                document.querySelector(".no-tags-message").style.display = "flex";
                document.querySelector(".no-tasks-in-tag-message").style.display = "none";
            }
        }

    })
    

}

function saveSingleTask (obj) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("completedTasks","readwrite");
    const IDBstorage = IDBtransaction.objectStore("completedTasks");

    IDBstorage.add(obj)

}

function showSingleTask () {

    document.querySelector(".single-tasks-completed-container").innerHTML="";

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("completedTasks","readonly");
    const IDBstorage = IDBtransaction.objectStore("completedTasks");
    const cursor = IDBstorage.openCursor();

    cursor.addEventListener("success",()=>{

        if (cursor.result) {

            let data = cursor.result.value;
            let key = cursor.result.key;

            document.querySelector(".single-tasks-completed-container").appendChild(createToDoList(data, key, true));

            cursor.result.continue();

        } else {

            let content = document.querySelector(".single-tasks-completed-container");
            let singleTasks = document.querySelector(".single-tasks-completed-container").children;

            if (content.innerHTML === "") document.querySelector(".no-single-tasks-message").style.display="flex";
            else document.querySelector(".no-single-tasks-message").style.display="none";

            for (let i = 0; i < singleTasks.length; i++) {

                let hoverStyle = singleTasks[i].querySelector(".hover-style");
                let checkbox = singleTasks[i].querySelector(".checkbox");

                checkbox.checked = true;
                singleTasks[i].removeChild(hoverStyle);

            }

            completedTasksVerification();

        }

    })

}

function deleteSingleTask (key) {

    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("completedTasks", "readwrite");
    const IDBstorage = IDBtransaction.objectStore("completedTasks");

    IDBtransaction.addEventListener("complete",showSingleTask);

    IDBstorage.delete(key);

}

///// Window Events //////////////////

window.addEventListener("resize",(e)=>{

    let currentWidth = e.currentTarget.innerWidth;

    const toggleTasks = document.querySelector(".toggle-tasks");
    const toggleTags = document.querySelector(".toggle-tags");
    const responsiveToggleTasks = document.querySelector(".responsive-toggle-tasks");
    const responsiveToggleTags = document.querySelector(".responsive-toggle-tags");

    if (currentWidth < 750) {

        if (toggleTasks.checked) {
            responsiveToggleTasks.checked=true;
            toggleTasks.checked=false;
        }
    
        if (toggleTags.checked) {
            responsiveToggleTags.checked=true;
            toggleTags.checked=false;
        }


    } else {
        if (responsiveToggleTasks.checked) {
            toggleTasks.checked=true;
            responsiveToggleTasks.checked=false;
        }

        if (responsiveToggleTags.checked) {
            toggleTags.checked=true;
            responsiveToggleTags.checked=false;
        }

    }

})

window.addEventListener("load",()=>{

    dateVerification();
    loadProfileSettings();
    loadLanguageSettings();
    loadThemeSettings();

})




 