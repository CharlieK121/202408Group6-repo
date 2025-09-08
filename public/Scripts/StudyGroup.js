
class studygroup{
    constructor(name,course,contact,location,time,coordx = 0,coordy = 0){
        this.name = name;
        this.course = course;
        this.contact = contact;
        this.location = location;
        this.time = time;
        this.coordx = coordx;
        this.coordy= coordy;        
    }
    getname(){
        return this.name;
    }
    getcourse(){
        return this.course;
    }
    getcontact(){
        return this.contact;
    }
    createStudygroupmarker()
    {
       var studygrouplocmark = L.marker([this.coordx,this.coordy]).addto(map);
    }
}

//Initalise Placeholder groups
const group1 = new studygroup("Group1","CS3307","discord.com/placeholder","Kennedy Library South","M W F 10:00AM - 11:00 AM",33.06748,-117.16750);
const group2 = new studygroup("Group2","CS2233","discord.com/hggh","John F Kennedy Library North","F 3:00PM - 4:00PM");
const group3 = new studygroup("Final study group 1","CS1100","discord.com/Placeholder1","Salazhar Hall","T Th 1:00 PM -2:00 PM");


//const p1selct = document.querySelector('.test')
const p2select = document.querySelector('.group');
p2select.textContent = group3.getname() + ":";
const p3selct = document.querySelector('.bullet1');
p3selct.textContent = group3.getcourse();
const select4 = document.querySelector('.bullet2');
select4.textContent = group3.getcontact();
const select5 = document.querySelector('.bullet3');
select5.textContent = group3.location;
const meeting1 = document.querySelector('.meet1');
meeting1.textContent = group3.time;

//p1selct.textContent = group1.getname() + ":"
const select6  = document.querySelector('.group2')
select6.textContent = group2.getname() + ":";
const select7 = document.querySelector('.bullet4');
select7.textContent = group2.getcourse();
const select8 = document.querySelector('.bullet5');
select8.textContent = group2.getcontact();
const select9 = document.querySelector('.bullet6');
select9.textContent = group2.location;
const meeting2 = document.querySelector('.meet2');
meeting2.textContent = group2.time;
/*
const addelement = document.createElement("li");
addelement.textContent = group1.getname() + "\n" + group1.getcourse() + "\n";
document.appendChild(addelement);
*/
const select10  = document.querySelector('.group3')
select10.textContent = group1.getname() + ":";
const select11 = document.querySelector('.bullet7');    
select11.textContent = group1.getcourse();
const select12 = document.querySelector('.bullet8');
select12.textContent = group1.getcontact();
const select13 = document.querySelector('.bullet9');
select13.textContent = group1.location;
const meeting3 = document.querySelector('.meet3');
meeting3.textContent = group1.time;

// Test to display study group on map
const select = document.querySelector("select");
const para = document.querySelector("p");


