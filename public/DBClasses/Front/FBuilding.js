class Building {
    constructor(name, latitude, longitude) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    print = () => {
        console.log(this.name,': ',this.latitude,', ',this.longitude);
    }
    getName = () => {return this.name;}
    getLat = () => {return this.latitude;}
    getLong = () => {return this.longitude;}

    setName = (name) => {this.name = name;}
    setLat = (latitude) => { this.latitude = latitude;}
    setLong = (longitude) => {this.longitude = longitude;}
}

export default Building;