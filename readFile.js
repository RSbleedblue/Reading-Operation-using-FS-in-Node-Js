import fs from 'fs';
import path from 'path';
import readline from 'readline';

const taskFilePath = path.join(process.cwd(), 'tasks.txt');

console.log(taskFilePath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const loadTasks = () => {
    if (!fs.existsSync(taskFilePath)) {
        return [];
    }
    const data = fs.readFileSync(taskFilePath, 'utf8');
    return data.split('\n').filter(Boolean).map(line => {
        const [complete, ...description] = line.split(' ');
        return { description: description.join(' '), complete: complete === '[x]' };
    });
};

const saveTasks = (tasks) => {
    const data = tasks.map(task => `${task.complete ? '[x]' : '[ ]'} ${task.description}`).join('\n');
    fs.writeFileSync(taskFilePath, data);
};

const addTask = (taskDescription) => {
    const tasks = loadTasks();
    tasks.push({ description: taskDescription, complete: false });
    saveTasks(tasks);
    console.log('Task added.');
};

const viewTasks = () => {
    const tasks = loadTasks();
    tasks.forEach((task, index) => {
        const status = task.complete ? '[x]' : '[ ]';
        console.log(`${index + 1}. ${status} ${task.description}`);
    });
};

const markTaskComplete = (taskIndex) => {
    const tasks = loadTasks();
    if (taskIndex > 0 && taskIndex <= tasks.length) {
        tasks[taskIndex - 1].complete = true;
        saveTasks(tasks);
        console.log('Task marked as complete.');
    } else {
        console.log('Invalid task number.');
    }
};

const removeTask = (taskIndex) => {
    const tasks = loadTasks();
    if (taskIndex > 0 && taskIndex <= tasks.length) {
        tasks.splice(taskIndex - 1, 1);
        saveTasks(tasks);
        console.log('Task removed.');
    } else {
        console.log('Invalid task number.');
    }
};

const showMenu = () => {
    console.log('\nTask Manager');
    console.log('1. Add a new task');
    console.log('2. View tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');
    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                rl.question('Enter task description: ', (taskDescription) => {
                    addTask(taskDescription);
                    showMenu();
                });
                break;
            case '2':
                viewTasks();
                showMenu();
                break;
            case '3':
                rl.question('Enter task number to mark as complete: ', (taskNumber) => {
                    markTaskComplete(parseInt(taskNumber));
                    showMenu();
                });
                break;
            case '4':
                rl.question('Enter task number to remove: ', (taskNumber) => {
                    removeTask(parseInt(taskNumber));
                    showMenu();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option.');
                showMenu();
                break;
        }
    });
};

showMenu();

rl.on('close', () => {
    console.log('Exiting Task Manager.');
    process.exit(0);
});
