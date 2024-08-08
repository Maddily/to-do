import random from "random-key";
import controlStorage from "./storage";

export default class Project {
  constructor(name, id = random.generate()) {
    this._name = name;
    this._id = id;
    this._toDoLists = [];

    controlStorage.setProject(this);
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;

    controlStorage.updateProject(this);
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get toDoLists() {
    return this._toDoLists;
  }

  set toDoLists(value) {
    this._toDoLists = value;
  }

  addToDoList(toDoList) {
    if (this._toDoLists.includes(toDoList)) return;

    this._toDoLists.push(toDoList);
  }

  removeToDoList(toDoList) {
    this._toDoLists = this._toDoLists.filter((item) => item !== toDoList);

    controlStorage.removeToDosOfList(toDoList.toDos);
    controlStorage.removeList(toDoList);
  }
}
