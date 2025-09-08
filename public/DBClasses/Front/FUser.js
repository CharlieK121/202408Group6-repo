import Class from "./FClass.js";
class User {
    constructor(username, password, cin, fname, lname, classes = []) {
        this.username = username;
        this.password = password;
        this.cin = cin;
        this.fname = fname;
        this.lname = lname;
        this.classes = classes;
    }
    print = () => {
        console.log(
            `Username: ${this.username}, Password: ${this.password}, CIN: ${this.cin}, First Name: ${this.fname}, Last Name: ${this.lname}`
        );
        if(this.classes instanceof Class)
        this.classes.forEach((c) => {c.print()})
    }

    getUsername = () => { return this.username; }
    getPassword = () => { return this.password; }
    getCin = () => { return this.cin; }
    getFname = () => { return this.fname; }
    getLname = () => { return this.lname; }
    getClasses = () => { return this.classes; }

    setUsername = (username) => { this.username = username; }
    setPassword = (password) => { this.password = password; }
    setCin = (cin) => { this.cin = cin; }
    setFname = (fname) => { this.fname = fname; }
    setLname = (lname) => { this.lname = lname; }
    setClasses = (classes) => { this.classes = classes; }
}

export default User;