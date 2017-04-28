export let mouse = false;
export function mouseStatus(n) {
     mouse = n;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
