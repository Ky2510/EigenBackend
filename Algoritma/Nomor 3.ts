function totalAppears(input: string[], query: string[]): number[] {
    let total = new Array(query.length).fill(0);
    for(let i =0; i < input.length; i++) {
        for (let j = 0; j < query.length; j++) {
            if(input[i] === query[j]) {
                total[j] += 1
            }
        }
    }

    return total
}

let INPUT = ['xc', 'dz', 'bbb', 'dz']  
let QUERY = ['bbb', 'ac', 'dz']
console.log(totalAppears(INPUT, QUERY) );

 