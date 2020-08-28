export default {
  PREAMBLE: {
    NAME: /(?<=^NAME\=).*(?=\n)/m,
    DIFFICULTY: /(?<=^DIFFICULTY\=).*(?=\n)/m,
    PATH: /(?<=^PATH\=).*(?=\n)/m,
    HASH: /(?<=^HASH\=).*(?=\n)/m,
  },
}
