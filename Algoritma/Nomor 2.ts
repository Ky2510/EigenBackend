function longestSentence(inputSentence: string): {word: string, length: number} {
    let words = inputSentence.split(' ');
    let longestWord = words[0]
    for (let word of words) {
        if (word.length > longestWord.length){
            longestWord = word
        }
    }
    return{ word: longestWord, length: longestWord.length}
}

let inputSentence = "Saya sangat senang mengerjakan soal algoritma"
console.log(longestSentence(inputSentence));
