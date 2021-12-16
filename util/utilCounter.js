let counter = 0

export function getCounter() {
  return counter;
}

export function setCounter(int) {
  counter = int
}

export function upOne() {
  counter++;
}

export function upX(x) {
  counter += x
}
