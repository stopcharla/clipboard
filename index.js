const crypto = require("crypto");

exports.createHash = (data) => {
  return  crypto.createHash("sha3-512").update(data).digest("hex");
}

exports.getCandidateKeyFromEvent = (event) => {
  let candidate;
  if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      console.log('not here');
      candidate = this.createHash(JSON.stringify(event));
    }
  return candidate;
}

exports.validateCandidateKey = (candidate, defaultKey) => {

  let newKey = candidate;

  if (candidate) {
    if (typeof candidate !== "string") {
      newKey = JSON.stringify(candidate);
    }
  } else {
    newKey = defaultKey;
  }

  return newKey;
}

exports.checkKeyLengthAndUpdate = (candidate, length) => {
  if (candidate.length > length) {
    return this.createHash(candidate);
  }
  return candidate;
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    candidate = this.getCandidateKeyFromEvent(event);
  }

  candidate = this.validateCandidateKey(candidate, TRIVIAL_PARTITION_KEY);

  return this.checkKeyLengthAndUpdate(candidate, MAX_PARTITION_KEY_LENGTH);
};