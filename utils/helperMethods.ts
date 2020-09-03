const generateRandomNumbers = (min: number, max: number): number => {
    /*
      Will generate numbers between start and end INCLUSIVE
      Example:
      Start = 5
      End = 10
      Will Generate the possibilities: 5,6,7,8,9,10
      */

    return Math.floor(Math.random() * (max + 1 - min)) + min;
};

const generateChance = (percentChance: number): boolean => {
    /*
      Will generate a chance for something to occur
      */

    // decrement percent chance by 1 - we are indexing by 0
    percentChance -= 1;

    const randomNum = generateRandomNumbers(0, 100);

    // Probability is true when the number of percent is equal or less than
    // the random number generated
    return percentChance >= randomNum;
};

export { generateRandomNumbers, generateChance };
