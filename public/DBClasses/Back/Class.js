const Building = require("./Building");
class Class {
    constructor(subject, catalog, section, number, title, days, start, end, building = null, room, instructor) {
        this.subject = subject;
        this.catalog = catalog;
        this.section = section;
        this.number = number;
        this.title = title;
        this.days = days;
        this.start = start;
        this.end = end;
        this.building = building;
        this.room = room;
        this.instructor = instructor;
    }

    print = () => {
        console.log(
            `${this.subject} ${this.catalog} - ${this.section} (${this.number}) ${this.title}:
            ${this.days} FROM ${this.start} TO ${this.end}`);
        console.log('AT');
        if(this.building instanceof Building) {
            this.building.print();
        }
        console.log(`Room ${this.room}, ${this.instructor}`);
    }

    // Getter methods
    getSubject = () => { return this.subject; }
    getCatalog = () => { return this.catalog; }
    getSection = () => { return this.section; }
    getNumber = () => { return this.number; }
    getTitle = () => { return this.title; }
    getDays = () => { return this.days; }
    getStart = () => { return this.start; }
    getEnd = () => { return this.end; }
    getBuilding = () => { return this.building; }
    getRoom = () => { return this.room; }
    getInstructor = () => { return this.instructor; }

    // Setter methods
    setSubject = (subject) => { this.subject = subject; }
    setCatalog = (catalog) => { this.catalog = catalog; }
    setSection = (section) => { this.section = section; }
    setNumber = (number) => { this.number = number; }
    setTitle = (title) => { this.title = title; }
    setDays = (days) => { this.days = days; }
    setStart = (start) => { this.start = start; }
    setEnd = (end) => { this.end = end; }
    setBuilding = (building) => { this.building = building; }
    setRoom = (room) => { this.room = room; }
    setInstructor = (instructor) => { this.instructor = instructor; }
}

module.exports = Class;