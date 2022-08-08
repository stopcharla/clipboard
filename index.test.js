const index = require('./index.js');

test('test getCandidateKeyFrom event with no partition key', () => {

  const mock = jest.spyOn(index, 'createHash');
  mock.mockReturnValue('abcdef');

  const event = {a:1};
  const candidate = index.getCandidateKeyFromEvent(event);
  expect(mock).toBeCalledWith(JSON.stringify(event));
  expect(candidate).toEqual('abcdef');
});

test('test getCandidateKeyFrom event with partition key', () => {
  const candidate = index.getCandidateKeyFromEvent({a:1, partitionKey: '1234'})
  expect(candidate).toEqual('1234');
});

test('should return the same key if candidate key is valid and string', () => {
  const candidate = index.validateCandidateKey('abcdefg');
  expect(candidate).toEqual('abcdefg')
})

test('should return the string same object if candidate key is object', () => {
  const key = {a:1, b:2}
  const candidate = index.validateCandidateKey(key);
  expect(candidate).toEqual(JSON.stringify(key));
})

test('should return default value candidate key undefined/null', () => {
  const candidate = index.validateCandidateKey(undefined, 'defaultKey');
  expect(candidate).toEqual('defaultKey');
});

test('should return hashed value of candidate key if key is greater than length', () => {
  const mock = jest.spyOn(index, 'createHash');
  mock.mockReturnValue('abcdef');

  const candidate = index.checkKeyLengthAndUpdate('abcdefghijklmnopqrst', '7');
  expect(candidate).toEqual('abcdef');
});

test('should return candidate key if key is less than length', () => {
  const candidate = index.checkKeyLengthAndUpdate('abcdefghijklmnopqrst', '50');
  expect(candidate).toEqual('abcdefghijklmnopqrst');
});

test('should return key from event', () => {
  const mock = jest.spyOn(index, 'createHash');
  mock.mockReturnValue('abcdef');

  const candidate = index.deterministicPartitionKey({ partitionKey: '12345' });
  expect(candidate).toEqual('12345');
})

test('should return the hashed key', () => {
  const mock = jest.spyOn(index, 'createHash');
  mock.mockReturnValue('abcdef');

  const candidate = index.deterministicPartitionKey({ a: '12345' });
  expect(candidate).toEqual('abcdef');
})

afterEach(() => {    
  jest.clearAllMocks();
});

