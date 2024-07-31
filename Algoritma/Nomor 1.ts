function reverseAlphabet(inputString: string): string {
    let alphabets = inputString.split('').filter(char => /[a-zA-Z]/.test(char)).join('');
    let numbers = inputString.split('').filter(char => /[0-9]/.test(char)).join('');
    let reversedAlphabets = alphabets.split('').reverse().join('');
    return reversedAlphabets + numbers;
}

const inputString = "neg1ie ";
const result = reverseAlphabet(inputString);
console.log(result);
