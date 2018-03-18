var prefixesArr = require('./ranges-array.js').prefixesArr;
var groupsArr = require('./ranges-array.js').groupsArr;

class Ranges{
    
    constructor()
    {
        this.prefixes = [];
        this.groups = [];

        for(var i=0;i<prefixesArr.length;i++){
            this.prefixes.push(prefixesArr[i]);
        }

        for(var i=0;i<groupsArr.length;i++){
            this.groups.push(groupsArr[i]);
        }
    }
    
    getPrefixes()
    {
        return this.prefixes;
    }

    getGroups()
    {
        return this.groups;
    }

    setPrefixes(p){
        this.prefixes = p;
    }

    setGroups(g){
        this.groups = g;
    }
}

module.exports.Ranges = Ranges;