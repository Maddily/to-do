import random from "random-key";
import controlStorage from "./storage";

export default class ToDoList {
  constructor(
    title,
    description,
    id = random.generate(),
    projectId = undefined
  ) {
    this._title = title;
    this._description = description;
    this._id = id;
    this._projectId = projectId;
    this._toDos = [];

    controlStorage.setList(this);
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;

    controlStorage.updateList(this);
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;

    controlStorage.updateList(this);
  }

  get id() {
    return this._id;
  }

  get projectId() {
    return this._projectId;
  }

  get toDos() {
    return this._toDos;
  }

  set toDos(value) {
    this._toDos = value;
  }

  addToDo(toDo) {
    if (this._toDos.includes(toDo)) return;

    this._toDos.push(toDo);
  }

  removeToDo(toDo) {
    const toDoIndex = this._toDos.indexOf(toDo);

    if (toDoIndex === -1) return;

    this._toDos.splice(toDoIndex, 1);

    controlStorage.removeToDo(toDo);
  }
}
