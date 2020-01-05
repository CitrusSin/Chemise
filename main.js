class Chemical {
    constructor(exp) {
        this.exp = exp;
        this.elements = [];
        this.elementCount = new Map();
        this.elec = 0;
        var reading = "";
        var num = 0;
        var readingElec = false;
        var elecS = "";
        for (let i = 0; i < exp.length; i++) {
            var c = exp.charCodeAt(i);
            if (readingElec) {
                if (exp[i] == '*' || exp[i] == '-') {
                    if (elecS.length > 0) {
                        this.elec = parseInt(elecS);
                    } else {
                        this.elec = 1;
                    }
                    if (exp[i] == '-') {
                        this.elec = -this.elec;
                    }
                } else {
                    elecS += exp[i];
                }
            } else if (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) {
                if (i != 0) {
                    this.addElement(reading, num);
                    num = 0;
                    reading = "";
                }
                reading += exp[i];
            } else if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) {
                num = (num * 10) + (c & 0x0F);
            } else if (exp[i] == '(') {
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
            } else if (exp[i] == '^') {
                this.addElement(reading, num);
                readingElec = true;
            } else {
                reading += exp[i];
            }
        }
        if (!readingElec) {
            this.addElement(reading, num);
        }
    }

    addElement(name, num) {
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
}

function getMaxDiv(a, b) {
    while (a % b != 0) {
        var c = a % b;
        a = b;
        b = c;
    }
    return b;
}

function getMinMulti(a, b) {
    return a * b / getMaxDiv(a, b);
}

function getListMinMulti(list) {
    var comm = list[0];
    for (let n=1;n<list.length;n++) {
        comm = getMinMulti(comm, list[n]);
    }
    return comm;
}

class Rational {
    constructor(numer, deno){
        var maxDiv = getMaxDiv(numer, deno);
        this.numer = numer / maxDiv;
        this.deno = deno / maxDiv;
    }

    add(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        var num1 = this.numer;
        var deno1 = this.deno;
        var num2 = rational.numer;
        var deno2 = rational.deno;
        var minMulti = getMinMulti(deno1, deno2);
        num1 *= (minMulti / deno1);
        num2 *= (minMulti / deno2);
        return new Rational(num1+num2, minMulti);
    }

    subtractBy(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        var num1 = this.numer;
        var deno1 = this.deno;
        var num2 = rational.numer;
        var deno2 = rational.deno;
        var minMulti = getMinMulti(deno1, deno2);
        num1 *= (minMulti / deno1);
        num2 *= (minMulti / deno2);
        return new Rational(num1-num2, minMulti);
    }

    multiply(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        return new Rational(this.numer * rational.numer, this.deno * rational.deno);
    }

    divideBy(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        if (rational.numer == 0) {
            throw "Divided by zero";
        }
        return new Rational(this.numer * rational.deno, this.deno * rational.numer);
    }

    negative() {
        return new Rational(-this.numer, this.deno);
    }

    compareTo(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        let cm = getMinMulti(rational.deno, this.deno);
        let ref1 = rational.numer * cm / rational.deno;
        let ref2 = this.numer * cm / this.deno;
        if (ref2 > ref1) {
            return 1;
        } else if (ref2 == ref1) {
            return 0;
        } else {
            return -1;
        }
    }

    toString() {
        return this.numer + "/" + this.deno;
    }
}

function getUnion(list1, list2) {
    var union = [];
    list1.forEach(element => {
        if (union.find(e => e == element) == undefined) {
            union.push(element);
        }
    });
    list2.forEach(element => {
        if (union.find(e => e == element) == undefined) {
            union.push(element);
        }
    });
    return union;
}

function getDiff(list1, list2) {
    var diff = [];
    list1.forEach(element => {
        if (list2.find(e => e == element) == undefined) {
            diff.push(element);
        }
    });
    list2.forEach(element => {
        if (list1.find(e => e == element) == undefined) {
            diff.push(element);
        }
    }); 
    return diff;
}

function balance(inputEqu) {
    //try {
        var arr1 = inputEqu.split("=>");
        if (arr1.length != 2) {
            throw "化学方程式格式错误！";
        }
        var leftchemstr = arr1[0].split("+");
        var rightchemstr = arr1[1].split("+");
        var leftChems = [];
        var rightChems = [];
        leftchemstr.forEach(element => leftChems.push(new Chemical(element)));
        rightchemstr.forEach(element => rightChems.push(new Chemical(element)));
        var leftElements = [];
        var rightElements = [];
        leftChems.forEach(chem => leftElements = getUnion(leftElements, chem.elements));
        rightChems.forEach(chem => rightElements = getUnion(rightElements, chem.elements));
        var diffs = getDiff(leftElements, rightElements);
        if (diffs.length > 0) {
            throw "元素" + diffs.join(", ") + "不守恒！";
        }
        var matrix = [];
        for (let i=0;i<leftElements.length;i++) {
            var element = leftElements[i];
            var row = [];
            for (let a = 0;a<leftChems.length;a++) {
                var chem = leftChems[a];
                if (chem.elements.find(e => e == element) != undefined) {
                    row[a] = new Rational(chem.elementCount.get(element), 1);
                } else {
                    row[a] = new Rational(0, 1);
                }
            }
            for (let a=0;a<rightChems.length;a++) {
                var chem = rightChems[a];
                if (chem.elements.find(e => e == element) != undefined) {
                    row[a+leftChems.length] = new Rational(-chem.elementCount.get(element), 1);
                } else {
                    row[a+leftChems.length] = new Rational(0, 1);
                }
            }
            matrix[i] = row;
        }
        var elecRow = [];
        for (let a = 0;a<leftChems.length;a++) {
            var chem = leftChems[a];
            elecRow[a] = new Rational(chem.elec, 1);
        }
        for (let a=0;a<rightChems.length;a++) {
            var chem = rightChems[a];
            elecRow[a+leftChems.length] = new Rational(-chem.elec, 1);
        }
        matrix.push(elecRow);
        var simCount = Math.min(matrix.length, matrix[0].length-1);
        matrix.forEach((row, index) => {
            if (row.find(n => n.compareTo(0) != 0) == undefined) {
                matrix.splice(index, 1);
            }
        });
        for (let y1=0;y1<matrix.length;y1++) {
            for (let y2=0;y2<matrix.length;y2++) {
                if (y1 != y2) {
                    var isFullyEqual = true;
                    var k = undefined;
                    for (let referX=0;referX<matrix[0].length;referX++) {
                        if (matrix[y1][referX].compareTo(0) != 0 && matrix[y2][referX].compareTo(0) != 0) {
                            k = matrix[y1][referX].divideBy(matrix[y2][referX]);
                            break;
                        }
                    }
                    if (k != undefined) {
                        for (let x=0;x<matrix[0].length;x++) {
                            if ((matrix[y2][x].compareTo(0) != 0 && matrix[y1][x].divideBy(matrix[y2][x]).compareTo(k) != 0)
                                || (matrix[y2][x].compareTo(0) == 0 && matrix[y1][x].compareTo(0) != 0)) {
                                isFullyEqual = false;
                                break;
                            }
                        }
                        if (isFullyEqual) {
                            matrix.splice(y2, 1);
                        }
                    }
                }
            }
        }
        for (let h=0;h<simCount;h++) {
            if (matrix[h][h].compareTo(0) == 0) {
                for (let i=0;i<matrix.length;i++) {
                    if (matrix[i][h].compareTo(0) != 0) {
                        for (let x=0;x<matrix[i].length;x++) {
                            matrix[h][x] = matrix[h][x].add(matrix[i][x]);
                        }
                        break;
                    }
                }
            }
        }
        for(let column=0;column<simCount;column++) {
            for (let y=0;y<matrix.length;y++) {
                if (y != column && matrix[y][column].compareTo(0) != 0) {
                    var target = matrix[y][column];
                    var k = matrix[column][column].negative().divideBy(target);
                    for (let x=0;x<matrix[y].length;x++) {
                        matrix[y][x] = matrix[y][x].multiply(k).add(matrix[column][x]);
                    }
                }
            }
        }
        for (let h=0;h<simCount;h++) {
            var k = new Rational(1, 1).divideBy(matrix[h][h]);
            for (let x=0;x<matrix[0].length;x++){
                matrix[h][x] = matrix[h][x].multiply(k);
            }
        }
        var x = matrix[0].length-1;
        var coefs = [];
        for (let i=0;i<(leftChems.length+rightChems.length-1);i++) {
            coefs[i] = matrix[i][x].negative();
        }
        coefs.push(new Rational(1, 1));
        var denos = [];
        coefs.forEach(coef => denos.push(coef.deno));
        var minMulti = getListMinMulti(denos);
        for (let i=0;i<coefs.length;i++) {
            coefs[i] = coefs[i].multiply(minMulti);
        }
        var result = "";
        for (let i=0;i<leftChems.length;i++) {
            if (coefs[i].numer != 1) {
                result += coefs[i].numer.toString()
            }
            result += leftChems[i].exp;
            if (i < (leftChems.length - 1)) {
                result += "+";
            }
        }
        result += "===";
        for (let i=0;i<rightChems.length;i++) {
            if (coefs[i+leftChems.length].numer != 1) {
                result += coefs[i+leftChems.length].numer.toString();
            }
            result += rightChems[i].exp;
            if (i < (rightChems.length - 1)) {
                result += "+";
            }
        }
        return result;
    //} catch(err) {
        //throw "错误: "+err;
    //}
}