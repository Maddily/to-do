import random from "random-key";
import { isValid, format } from "date-fns";
import controlStorage from "./storage";

export default class ToDo {
  constructor(name, id = random.generate(), listId = undefined) {
    this._name = name;
    this._id = id;
    this._listId = listId;
    this._checklist = {};
    this._dueDate = "";

    controlStorage.setToDo(this);
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value.trim();

    controlStorage.updateToDo(this);
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get listId() {
    return this._listId;
  }

  get notes() {
    return this._notes;
  }

  set notes(value) {
    this._notes = value.trim();

    controlStorage.updateToDo(this);
  }

  get checklist() {
    return this._checklist;
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(date) {
    if (!isValid(date)) return;

    this._dueDate = format(date, "dd-MM-yyyy");

    controlStorage.updateToDo(this);
  }

  addToChecklist(item) {
    if (item.trim() in this._checklist) return;

    this._checklist[item.trim()] = false;

    controlStorage.updateToDo(this);
  }

  removeFromChecklist(item) {
    if (!(item.trim() in this._checklist)) return;

    delete this._checklist[item.trim()];

    controlStorage.updateToDo(this);
  }

  /* updateChecklistItem (item, value) {
    if (!(item.trim() in this._checklist)) return;

    if (item.trim() !== value.trim()) {
      Object.defineProperty(
        this._checklist,
        value.trim(),
        Object.getOwnPropertyDescriptor(this._checklist, item.trim())
      );
      delete this._checklist[item.trim()];
    }
  } */

  toggleCheckedStatus(item) {
    if (item.trim() in this._checklist) {
      this._checklist[item.trim()] = this._checklist[item.trim()]
        ? false
        : true;

      controlStorage.updateToDo(this);
    }
  }
}
