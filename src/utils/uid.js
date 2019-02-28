export default function uid(size = 8) {
  return Math.random()
    .toString(10)
    .substr(4, size);
}
