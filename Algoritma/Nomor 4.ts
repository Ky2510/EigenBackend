function diagonalDifferences(matrix: number[][]) : number {
    let diagonalOne = 0;
    let diagonalTwo = 0;

    for(let i = 0; i < matrix.length; i++){
        diagonalOne += matrix[i][i];
        diagonalTwo += matrix[i][matrix.length - i - 1]
    }
    let total = Math.abs(diagonalOne - diagonalTwo)
    return total
}


let matrix = [
    [1,2,0],
    [4,5,6],
    [7,8,9]
]
console.log("Selisihnya : " + diagonalDifferences(matrix));
