// This runs once at app startup
if (!BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () {
    return this.toString(); // ensures safe JSON
  };
}
