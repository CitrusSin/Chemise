class Chemical {
    constructor(exp) {
        this.exp = exp;
        this.elements = [];
        this.elementCount = new Map();
        this.elec = 0;
        let reading = "";
        let num = 0;
        let readingElec = false;
        let elecS = "";
        for (let i = 0; i < exp.length; i++) {
            let c = exp.charCodeAt(i);
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
                let index = exp.indexOf(')', i + 1);
                let subChem = new Chemical(exp.slice(i + 1, index));
                let k = 0;
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
            let count = this.elementCount.get(name);
            this.elementCount.set(name, count + num);
        }
    }
}

function getMaxDiv(a, b) {
    while (a % b != 0) {
        let c = a % b;
        a = b;
        b = c;
    }
    return b;
}

function getMinMulti(a, b) {
    return a * b / getMaxDiv(a, b);
}

function getListMinMulti(list) {
    let comm = list[0];
    for (let n=1;n<list.length;n++) {
        comm = getMinMulti(comm, list[n]);
    }
    return comm;
}

class Rational {
    constructor(numer, deno){
        let maxDiv = getMaxDiv(numer, deno);
        this.numer = numer / maxDiv;
        this.deno = deno / maxDiv;
    }

    add(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        let num1 = this.numer;
        let deno1 = this.deno;
        let num2 = rational.numer;
        let deno2 = rational.deno;
        let minMulti = getMinMulti(deno1, deno2);
        num1 *= (minMulti / deno1);
        num2 *= (minMulti / deno2);
        return new Rational(num1+num2, minMulti);
    }

    subtractBy(rational) {
        if (typeof(rational) == "number") {
            rational = new Rational(rational, 1);
        }
        let num1 = this.numer;
        let deno1 = this.deno;
        let num2 = rational.numer;
        let deno2 = rational.deno;
        let minMulti = getMinMulti(deno1, deno2);
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

    abs() {
        return new Rational(Math.abs(this.numer), Math.abs(this.deno));
    }

    toString() {
        if (this.deno == 1) {
            return this.numer.toString();
        }
        return this.numer + "/" + this.deno;
    }
}

function debugMatrix(matrix) {
    for (let i=0;i<matrix.length;i++) {
        let str = "";
        for (let j=0;j<matrix[i].length;j++) {
            let nums = matrix[i][j].toString()
            str += nums + " ".repeat(8-nums.length);
        }
        console.log(str);
    }
}

function getUnion(list1, list2) {
    let union = [];
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
    let diff = [];
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
    try {
        let arr1 = inputEqu.split("=");
        if (arr1.length != 2) {
            throw "化学方程式格式错误！";
        }
        let leftchemstr = arr1[0].split("+");
        let rightchemstr = arr1[1].split("+");
        let leftChems = [];
        let rightChems = [];
        leftchemstr.forEach(element => leftChems.push(new Chemical(element)));
        rightchemstr.forEach(element => rightChems.push(new Chemical(element)));
        let leftElements = [];
        let rightElements = [];
        leftChems.forEach(chem => leftElements = getUnion(leftElements, chem.elements));
        rightChems.forEach(chem => rightElements = getUnion(rightElements, chem.elements));
        let diffs = getDiff(leftElements, rightElements);
        if (diffs.length > 0) {
            throw "元素" + diffs.join(", ") + "不守恒！";
        }
        // 构建矩阵以解线性方程组（有多解）
        let matrix = [];
        for (let i=0;i<leftElements.length;i++) {
            let element = leftElements[i];
            let row = [];
            for (let a = 0;a<leftChems.length;a++) {
                let chem = leftChems[a];
                if (chem.elements.find(e => e == element) != undefined) {
                    row[a] = new Rational(chem.elementCount.get(element), 1);
                } else {
                    row[a] = new Rational(0, 1);
                }
            }
            for (let a=0;a<rightChems.length;a++) {
                let chem = rightChems[a];
                if (chem.elements.find(e => e == element) != undefined) {
                    row[a+leftChems.length] = new Rational(-chem.elementCount.get(element), 1);
                } else {
                    row[a+leftChems.length] = new Rational(0, 1);
                }
            }
            matrix[i] = row;
        }
        let elecRow = [];
        for (let a = 0;a<leftChems.length;a++) {
            let chem = leftChems[a];
            elecRow[a] = new Rational(chem.elec, 1);
        }
        for (let a=0;a<rightChems.length;a++) {
            let chem = rightChems[a];
            elecRow[a+leftChems.length] = new Rational(-chem.elec, 1);
        }
        matrix.push(elecRow);
        let simCount = Math.min(matrix.length, matrix[0].length-1);
        // 移除没有意义的行（例如全为0的行或与其它行向量平行）
        // 先移除全为0的行
        matrix.forEach((row, index) => {
            if (row.find(n => n.compareTo(0) != 0) == undefined) {
                matrix.splice(index, 1);
            }
        });
        // 再移除与其它行向量平行的行
        // 遍历所有不重复的2行组
        for (let y1=0;y1<matrix.length;y1++) {
            for (let y2=0;y2<matrix.length;y2++) {
                if (y1 != y2) {
                    let isFullyEqual = true;
                    let k = undefined;
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
        // 使用高斯消元法先将对角线左下角所有元素全变成0
        for (let column=0;column<simCount;column++) {
            // 获取此列包括对角线元素中绝对值最大的行
            let maxRowIndex = 0;
            let maxNum = new Rational(0, 1);
            for (let row=column;row<matrix.length;row++) {
                if (matrix[row][column].abs().compareTo(maxNum) > 0) {
                    maxRowIndex = row;
                    maxNum = matrix[row][column].abs();
                }
            }
            // 将最大的行交换到顶行
            let swapBuf = matrix[maxRowIndex];
            matrix[maxRowIndex] = matrix[column];
            matrix[column] = swapBuf;
            // 将顶行对角线元素化为1
            let prev = matrix[column][column];
            for (let i=0;i<matrix[column].length;i++) {
                matrix[column][i] = matrix[column][i].divideBy(prev);
            }
            // 将所有下行对应元素化为0
            for (let row=column+1;row<matrix.length;row++) {
                let k = matrix[row][column];
                for (let i=0;i<matrix[row].length;i++) {
                    matrix[row][i] = matrix[row][i].subtractBy(matrix[column][i].multiply(k));
                }
            }
        }
        // 再将右上角化为0
        for (let column=simCount-1;column>=0;column--) {
            for (let row=column-1;row>=0;row--) {
                let prev = matrix[row][column]
                for (let i=0;i<matrix[row].length;i++) {
                    matrix[row][i] = matrix[row][i].subtractBy(matrix[column][i].multiply(prev));
                }
            }
        }
        // 取出矩阵中的结果
        let x = matrix[0].length-1;
        let coefs = [];
        for (let i=0;i<(leftChems.length+rightChems.length-1);i++) {
            coefs[i] = matrix[i][x].negative();
        }
        coefs.push(new Rational(1, 1));
        let denos = [];
        coefs.forEach(coef => denos.push(coef.deno));
        let minMulti = getListMinMulti(denos);
        for (let i=0;i<coefs.length;i++) {
            coefs[i] = coefs[i].multiply(minMulti);
        }
        let result = "";
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
    } catch(err) {
        throw "错误: "+err;
    }
}