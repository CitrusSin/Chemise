function Chemical(exp) {
    this.exp = exp;
    this.elements = [];
    this.elementCount = new Map();
    var reading = "";
    var num = 0;
    for (var i = 0; i < exp.length; i++) {
        var c = exp.charCodeAt(i);
        if (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) {
            if (i != 0) {
                 this.addElement(reading, num);
                 num = 0;
                  reading = "";
             }
            reading += exp[i];
        } else if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) {
            num = (num * 10) + (c & 0x0F);
        } else if (c == '('.charCodeAt(0)) {
            if (reading.length > 0) {
                this.addElement(reading, num);
                num = 0;
                reading = "";
            }
            var index = exp.indexOf(')', i + 1);
            var subChem = new Chemical(exp.slice(i + 1, index));
            var k = 0;
            index++;
            while (exp.length > index && exp.charCodeAt(index) >= '0'.charCodeAt(0) && exp.charCodeAt(index) <= '9'.charCodeAt(0)) {
                k *= 10;
                k += exp.charCodeAt(index) & 0x0F;
                index++;
            }
            if (k == 0) {
                k = 1;
            }
            subChem.elements.forEach(element => this.addElement(element, subChem.elementCount.get(element) * k));
            i = index - 1;
        } else {
            reading += exp[i];
        }
    }
    this.addElement(reading, num);
}

Chemical.prototype.addElement = function(name, num) {
    if (name == "") {
        return;
    }
    if (num == 0) {
        num = 1;
    }
    if (this.elements.find(arg => arg == name) == undefined) {
        this.elements.push(name);
        this.elementCount.set(name, num);
    } else {
        var count = this.elementCount.get(name);
        this.elementCount.set(name, count + num);
    }
}

function balance(inputEqu) {
    var arr1 = inputEqu.split("-");
    if (arr1.length != 2) {
        return "Error: Wrong pattern of chemical equation!";
    }
    var leftchemstr = arr1[0].split("+");
    var rightchemstr = arr1[1].split("+");
    var leftChems = [];
    var rightChems = [];
    leftchemstr.forEach(element => leftChems.push(new Chemical(element)));
    rightchemstr.forEach(element => rightChems.push(new Chemical(element)));
}