function convertAngularBracket(string) {
    let item = string.split("<").slice(1,)
    let arr = []
    for (let p of item) {
        arr.push(p.split(':')[1].split('>')[0]);
    }
    return arr
}
